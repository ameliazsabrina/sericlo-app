import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import path from "path";
import { createClient } from "./utils/supabase/server";
import userRoutes from "./routes/users";
import productRoutes from "./routes/marketplace";
import donationRoutes from "./routes/donations";
import aiRoutes from "./routes/ai";
import cartRoutes from "./routes/cart";
import checkoutRoutes from "./routes/checkout";
import sellerRoutes from "./routes/seller";

dotenv.config();

const app = express();
const compression = require("compression");

const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || "https://sericlo.my.id/";

app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());

const checkSupabaseConnection = async () => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("_health").select("*").limit(1);

    if (error) {
      console.error("Error connecting to Supabase:", error);
    } else {
      console.log("Supabase connected successfully");
    }
  } catch (err) {
    console.error("Error checking Supabase connection:", err);
  }
};

if (process.env.NODE_ENV !== "production") {
  checkSupabaseConnection();
}

app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
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
  })
);

app.options("*", cors());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/seller", sellerRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to Sericlo API" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to Sericlo API" });
  });
}

if (process.env.NODE_ENV === "production") {
  app.use("/_next", express.static(path.join(__dirname, "../client/.next")));
  app.use(
    "/static",
    express.static(path.join(__dirname, "../client/.next/static"))
  );

  app.use(express.static(path.join(__dirname, "../client/public")));

  app.get("*", (req: Request, res: Response) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ error: "API route not found" });
    }

    res.sendFile(
      path.join(__dirname, "../client/.next/server/pages/index.html")
    );
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to Sericlo API" });
  });
}

console.log("Server is running on port", PORT);
app.listen(PORT);

export default app;
