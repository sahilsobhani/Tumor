const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const PORT = 8001; // Node.js server running on a different port
const upload = multer({ dest: "uploads/" });

const FASTAPI_URL = "http://127.0.0.1:8000/predict_brain_tumor/"; // Calling FastAPI locally

// 🚀 Node.js API to Call FastAPI
app.post("/predict", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));

        const response = await axios.post(FASTAPI_URL, formData, {
            headers: { ...formData.getHeaders() },
        });

        fs.unlinkSync(req.file.path); // Cleanup

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// Start Node.js Server
app.listen(PORT, () => console.log(`🚀 Node.js running at http://127.0.0.1:${PORT}`));
