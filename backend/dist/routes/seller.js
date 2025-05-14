"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../utils/supabase/server");
const users_1 = require("./users");
const router = express_1.default.Router();
router.get("/products", users_1.isAuthenticated, async (req, res) => {
    const seller_id = req.user.id;
    try {
        const supabase = await (0, server_1.createClient)();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("seller_id", seller_id)
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        console.error("Error fetching seller products:", err);
        res
            .status(500)
            .json({ success: false, error: "Failed to fetch products" });
    }
});
router.get("/orders", users_1.isAuthenticated, async (req, res) => {
    const seller_id = req.user.id;
    try {
        const supabase = await (0, server_1.createClient)();
        const { data: orders, error: ordersError } = await supabase
            .from("Orders")
            .select(`
        *,
        OrderItem (
          *,
          Product (
            id,
            name,
            image,
            seller_id
          )
        ),
        buyer:user_id (
          user_metadata
        )
      `)
            .order("created_at", { ascending: false });
        if (ordersError)
            throw ordersError;
        const sellerOrders = orders.filter((order) => order.OrderItem.some((item) => item.Product && item.Product.seller_id === seller_id));
        const transformedOrders = sellerOrders.map((order) => ({
            ...order,
            buyer_name: order.buyer?.user_metadata?.name || "Anonymous User",
        }));
        res.json({ success: true, data: transformedOrders });
    }
    catch (err) {
        console.error("Error fetching seller orders:", err);
        res
            .status(500)
            .json({ success: false, error: "Failed to fetch seller orders" });
    }
});
exports.default = router;
