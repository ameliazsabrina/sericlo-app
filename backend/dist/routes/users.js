"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../utils/supabase/server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split("Bearer ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ success: false, error: "No token provided" });
        }
        const supabase = (0, server_1.createClient)(token);
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
            return res.status(401).json({ success: false, error: "Invalid session" });
        }
        req.user = data.user;
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
};
exports.isAuthenticated = isAuthenticated;
// routes
router.get("/google", async (req, res) => {
    try {
        const supabase = await (0, server_1.createClient)();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                },
                redirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/marketplace`,
            },
        });
        if (error)
            throw error;
        res.json({ url: data.url });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to initiate Google OAuth" });
    }
});
router.get("/logout", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "No authorization header" });
        }
        const supabase = await (0, server_1.createClient)();
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
        res.json({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Logout failed" });
    }
});
router.get("/profile", exports.isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});
router.get("/profile/:id", exports.isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const supabase = await (0, server_1.createClient)();
        const { data: { user }, error, } = await supabase.auth.admin.getUserById(id);
        if (error) {
            return res.status(500).json({ error: "Failed to fetch user" });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
exports.default = router;
