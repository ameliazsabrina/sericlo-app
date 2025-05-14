"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, "../../uploads");
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|webp/;
        const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        else {
            cb(new Error("Error: Images Only!"));
        }
    },
});
router.get("/", async (_req, res) => {
    try {
        const { data, error } = await supabase
            .from("Donation")
            .select("*")
            .order("created_at", { ascending: false });
        if (error)
            throw error;
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Error fetching donations:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to fetch donations" });
    }
});
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const { data, error } = await supabase
            .from("Donation")
            .select("*")
            .eq("id", id)
            .single();
        if (error)
            throw error;
        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: "Donation not found" });
        }
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Error fetching donation:", error);
        res.status(500).json({ success: false, error: "Failed to fetch donation" });
    }
});
router.post("/", upload.single("image"), async (req, res) => {
    const { fullName, email, phone, address, city, postalCode, itemType, itemDescription, itemQuantity, pickup, } = req.body;
    if (!fullName ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !postalCode ||
        !itemType ||
        !itemDescription ||
        !itemQuantity ||
        !req.file) {
        return res.status(400).json({
            success: false,
            error: "Please provide all required fields",
        });
    }
    try {
        const fileExt = path_1.default.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("donations")
            .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
        });
        if (uploadError)
            throw uploadError;
        const { data: { publicUrl }, } = supabase.storage.from("donations").getPublicUrl(fileName);
        const { data: donation, error: insertError } = await supabase
            .from("Donation")
            .insert({
            full_name: fullName,
            email,
            phone,
            address,
            city,
            postal_code: postalCode,
            item_type: itemType,
            item_description: itemDescription,
            item_quantity: parseInt(itemQuantity),
            image_url: publicUrl,
            pickup: pickup === "true",
            status: "pending",
            created_at: new Date().toISOString(),
        })
            .select()
            .single();
        if (insertError)
            throw insertError;
        fs_1.default.unlinkSync(req.file.path);
        res.status(201).json({ success: true, data: donation });
    }
    catch (error) {
        console.error("Error creating donation:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create donation",
        });
    }
});
router.patch("/:id/status", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    if (!status ||
        !["pending", "approved", "rejected", "completed"].includes(status)) {
        return res
            .status(400)
            .json({ success: false, error: "Please provide a valid status" });
    }
    try {
        const { data, error } = await supabase
            .from("Donation")
            .update({
            status,
            updated_at: new Date().toISOString(),
        })
            .eq("id", id)
            .select()
            .single();
        if (error)
            throw error;
        if (!data) {
            return res
                .status(404)
                .json({ success: false, error: "Donation not found" });
        }
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error("Error updating donation status:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to update donation status" });
    }
});
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const { data: donation, error: fetchError } = await supabase
            .from("Donation")
            .select("image_url")
            .eq("id", id)
            .single();
        if (fetchError)
            throw fetchError;
        if (!donation) {
            return res
                .status(404)
                .json({ success: false, error: "Donation not found" });
        }
        if (donation.image_url) {
            const imagePath = donation.image_url.split("/").pop();
            if (imagePath) {
                await supabase.storage.from("donations").remove([imagePath]);
            }
        }
        const { error: deleteError } = await supabase
            .from("Donation")
            .delete()
            .eq("id", id);
        if (deleteError)
            throw deleteError;
        res.status(200).json({
            success: true,
            data: {},
            message: `Donation with id ${id} deleted`,
        });
    }
    catch (error) {
        console.error("Error deleting donation:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to delete donation" });
    }
});
exports.default = router;
