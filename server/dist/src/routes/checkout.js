"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("./users");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("../utils/supabase/server");
dotenv_1.default.config();
const router = express_1.default.Router();
const midtransClient = require("midtrans-client");
const snap = new midtransClient.Snap({
    isProduction: true,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
router.post("/", users_1.isAuthenticated, async (req, res) => {
    try {
        const user_id = req.user.id;
        const authHeader = req.headers.authorization;
        const token = authHeader?.split("Bearer ")[1];
        const supabase = (0, server_1.createClient)(token);
        const { data: cartItems, error: cartError } = await supabase
            .from("Cart")
            .select("quantity, Product (price, seller_id)")
            .eq("user_id", user_id);
        if (cartError) {
            console.error("Error fetching cart items:", cartError);
            return res
                .status(500)
                .json({ success: false, error: "Gagal memuat keranjang" });
        }
        if (!cartItems || cartItems.length === 0) {
            return res
                .status(400)
                .json({ success: false, error: "Keranjang kosong" });
        }
        const totalAmount = cartItems.reduce((sum, item) => sum + item.Product.price * item.quantity, 0);
        const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: Math.round(totalAmount),
            },
            customer_details: {
                first_name: req.user?.user_metadata?.name || "Customer",
                email: req.user?.email || "customer@example.com",
            },
        };
        const transaction = await snap.createTransaction(parameter);
        const transactionToken = transaction.token;
        res.json({
            success: true,
            token: transactionToken,
            orderId,
        });
    }
    catch (err) {
        console.error("Error creating Midtrans transaction:", err);
        res
            .status(500)
            .json({ success: false, error: "Gagal membuat transaksi pembayaran" });
    }
});
router.post("/confirm", users_1.isAuthenticated, async (req, res) => {
    try {
        const { orderId, transactionId, paymentType, status, amount } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader?.split("Bearer ")[1];
        const supabase = (0, server_1.createClient)(token);
        await supabase.from("Transaction").insert({
            order_id: orderId,
            transaction_id: transactionId,
            payment_type: paymentType,
            status,
            amount: parseInt(amount),
            created_at: new Date().toISOString(),
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Error confirming transaction:", err);
        res.status(500).json({
            success: false,
            error: "Gagal menyimpan konfirmasi pembayaran",
        });
    }
});
router.post("/webhook", async (req, res) => {
    try {
        const eventData = req.body;
        const { order_id, transaction_status, transaction_id, gross_amount } = eventData;
        const authHeader = req.headers.authorization;
        const token = authHeader?.split("Bearer ")[1];
        const supabase = (0, server_1.createClient)(token);
        const { error } = await supabase
            .from("Transaction")
            .update({
            status: transaction_status,
            updated_at: new Date().toISOString(),
        })
            .eq("order_id", order_id);
        if (error) {
            console.error("Error updating transaction in DB:", error);
            return res.status(500).send("Database update failed");
        }
        res.status(200).send("OK");
    }
    catch (err) {
        console.error("Webhook error:", err);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = router;
