import express from "express";
import Warehouse from "../models/warehouse.model.js";
import CategoryModel from '../models/category.model.js';
import SubCategoryModel from '../models/subcategory.model.js';
import ProductModel from '../models/product.model.js';
import OrderModel from '../models/order.model.js';

// count all Categories Subcategories Products Orders Warehouses
export async function CountAllDetails(req, res) {
  try {
    const [
      categoryCount,
      subCategoryCount,
      productCount,
      orderCount,
      acceptedOrders,
      rejectedOrders,
      pendingOrders,
      warehouseCount,
    ] = await Promise.all([
      CategoryModel.countDocuments(),
      SubCategoryModel.countDocuments(),
      ProductModel.countDocuments(),
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ status: "accepted" }),
      OrderModel.countDocuments({ status: "rejected" }),
      OrderModel.countDocuments({ status: "pending" }),
      Warehouse.countDocuments(),
    ]);

    res.json({
      success: true,
      data: {
        categories: categoryCount,
        subcategories: subCategoryCount,
        products: productCount,
        orders: orderCount,
        acceptedOrders,
        rejectedOrders,
        pendingOrders,
        warehouses: warehouseCount,
      },
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching counts" });
  }
}


export async function getWarehouseDetails(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, data: warehouse });
  } catch (err) {
    console.error("Warehouse fetch error:", err);
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}
// Create warehouse (Admin) edited
export async function createWarehouse(req, res) {
  try {
    const { name, location, coordinates } = req.body;
    const warehouse = new Warehouse({ name, location, coordinates });
    await warehouse.save();
    res.json({ success: true, warehouse });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating warehouse",
      error: true,
      success: false,
    });
  }
}

// Toggle warehouse status
export async function ShowWareHouseStatus(req, res) {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    // warehouse.isActive = !warehouse.isActive;
    await warehouse.save();
    return res.json({
      message: "Status updated successfully",
      error: false,
      success: true,
      data: warehouse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating status",
      error: true,
      success: false,
    });
  }
}

// Get all warehouses
export async function GetAllWarehouse(req, res) {
  try {
    const warehouses = await Warehouse.find();
    res.json({ success: true, data: warehouses });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch warehouses" });
  }
}

// Delete warehouse
export async function deleteWarehouse(req, res) {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting warehouse" });
  }
}

// Edit warehouse
export async function editWarehouse(req, res) {
  const { name, location, coordinates } = req.body;
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      {  name, location, coordinates },
      { new: true }
    );
    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }
    res.json({ success: true, message: "Warehouse updated", data: warehouse });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating warehouse" });
  }
}


