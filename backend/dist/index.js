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
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use((0, helmet_1.default)());
app.use(compression());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);
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
checkSupabaseConnection();
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
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
}));
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
    next();
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
app.listen(PORT);
