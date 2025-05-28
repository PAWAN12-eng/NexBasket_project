// import Razorpay from "razorpay";
// import crypto from "crypto";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.models.js";
import CartProductModel from "../models/cartproduct.model.js";
import Warehouse from "../models/warehouse.model.js";
import Address from "../models/address.model.js";
// import { findNearestWarehouse } from "../utils/findnearestlocation.js";

dotenv.config();
// _______________________________________________________________________________________________
const getDistance = (coord1, coord2) => {
  const rad = (deg) => deg * (Math.PI / 180);
  const R = 6371; // km
  const dLat = rad(coord2.lat - coord1.lat);
  const dLng = rad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(coord1.lat)) *
      Math.cos(rad(coord2.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const CashOnDeliveryController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmount, addressId, subTotalAmt } = req.body;

    const address = await Address.findById(addressId);
    if (!address || !address.coordinates?.lat || !address.coordinates?.lng) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address or coordinates" });
    }

    const warehouses = await Warehouse.find({
      active: true,
      coordinates: { $exists: true },
    });
    if (!warehouses.length) {
      return res
        .status(404)
        .json({ success: false, message: "No active warehouses found" });
    }

    // Find nearest warehouse
    let nearestWarehouse = null;
    let minDistance = Infinity;

    for (const warehouse of warehouses) {
      const dist = getDistance(address.coordinates, warehouse.coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestWarehouse = warehouse;
      }
    }

    if (!nearestWarehouse) {
      return res
        .status(500)
        .json({ success: false, message: "Could not find nearest warehouse" });
    }

    // Create orders
    const ordersPayload = list_items.map((item) => ({
      userId,
      address: addressId,
      warehouse: nearestWarehouse._id,
      orderId: uuidv4(),
      productId: item.productId._id,
      product_detalis: {
        name: item.productId.name,
        image: item.productId.image,
      },
      qty: item.quantity,
      subTotalAmt,
      totalAmt: totalAmount,
      payment_status: "Pending",
      paymentId: "",
      invoice_receipt: `INV-${Date.now()}`,
    }));

    const createdOrders = await orderModel.insertMany(ordersPayload);

    // Clear cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.updateOne({ _id: userId }, { $set: { shopping_cart: [] } });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: createdOrders,
    });
  } catch (err) {
    console.error("COD error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getWarehouseOrders = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse || !warehouse.coordinates?.lat || !warehouse.coordinates?.lng) {
      return res.status(400).json({ success: false, message: "Warehouse coordinates not found" });
    }

    const orders = await orderModel
      .find({ warehouse: warehouseId })
      .populate("productId")
      .populate("address")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Add distance calculation to each order
    const enrichedOrders = orders.map((order) => {
      const userCoords = order.address?.coordinates;
      let distance = null;

      if (userCoords?.lat && userCoords?.lng) {
        distance = getDistance(
          { lat: userCoords.lat, lng: userCoords.lng },
          { lat: warehouse.coordinates.lat, lng: warehouse.coordinates.lng }
        ).toFixed(2); // km rounded to 2 decimal
      }

      return {
        ...order.toObject(),
        distanceFromWarehouseKm: distance,
      };
    });

    return res.status(200).json({
      success: true,
      orders: enrichedOrders,
    });
  } catch (err) {
    console.error("Warehouse order fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ─── Get User Orders ────────────────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .populate("productId")
      .populate("address")
      .populate("warehouse")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data:orders,
    });
  } catch (err) {
    console.error("Get user orders error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderId || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid request" });
  }

  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: `Order ${status} successfully`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

