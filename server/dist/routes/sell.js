"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("../utils/supabase/server");
const users_1 = require("./users");
const router = express_1.default.Router();
router.post("/", users_1.isAuthenticated, async (req, res) => {
    const { name, price, condition, size, type, description, image, location } = req.body;
    if (!name ||
        !price ||
        !condition ||
        !size ||
        !type ||
        !description ||
        !image ||
        !location) {
        return res
            .status(400)
            .json({ success: false, error: "Please provide all required fields" });
    }
    try {
        const supabase = await (0, server_1.createClient)();
        const { data: { user }, error: userError, } = await supabase.auth.getUser();
        if (userError)
            throw userError;
        if (!user) {
            return res.status(401).json({
                success: false,
                error: "User not authenticated",
            });
        }
        const { data: product, error: insertError } = await supabase
            .from("products")
            .insert({
            name,
            price,
            condition,
            size,
            type,
            description,
            image,
            seller_id: user.id,
            seller_name: user.user_metadata?.name || "Anonymous User",
            location,
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (insertError)
            throw insertError;
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create product. Database error occurred.",
        });
    }
});
exports.default = router;
