"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const server_1 = require("./utils/supabase/server");
const users_1 = __importDefault(require("./routes/users"));
const marketplace_1 = __importDefault(require("./routes/marketplace"));
const donations_1 = __importDefault(require("./routes/donations"));
const ai_1 = __importDefault(require("./routes/ai"));
const cart_1 = __importDefault(require("./routes/cart"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const seller_1 = __importDefault(require("./routes/seller"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const compression = require("compression");
const PORT = process.env.PORT || "https://sericlo-6e15467e3310.herokuapp.com";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://sericlo-6e15467e3310.herokuapp.com";
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use(compression());
const checkSupabaseConnection = async () => {
    try {
        const supabase = await (0, server_1.createClient)();
        const { data, error } = await supabase.from("_health").select("*").limit(1);
        if (error) {
            console.error("Error connecting to Supabase:", error);
        }
        else {
            console.log("Supabase connected successfully");
        }
    }
    catch (err) {
        console.error("Error checking Supabase connection:", err);
    }
};
if (process.env.NODE_ENV !== "production") {
    checkSupabaseConnection();
}
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
    optionsSuccessStatus: 200,
}));
app.options("*", (0, cors_1.default)());
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/user", users_1.default);
app.use("/api/products", marketplace_1.default);
app.use("/api/donations", donations_1.default);
app.use("/api/ai", ai_1.default);
app.use("/api/cart", cart_1.default);
app.use("/api/checkout", checkout_1.default);
app.use("/api/seller", seller_1.default);
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Sericlo API" });
});
if (process.env.NODE_ENV !== "production") {
    console.log("Server is running on port", PORT);
    app.listen(PORT);
}
exports.default = app;
