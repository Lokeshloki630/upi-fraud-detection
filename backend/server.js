const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { spawn } = require("child_process");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
    res.send("UPI Fraud Detection API is running...");
});

// Fraud Prediction Route
app.post("/predict", (req, res) => {
    const inputData = JSON.stringify(req.body); // Convert request data to JSON

    const pythonProcess = spawn("python", ["predict.py", inputData]);

    pythonProcess.stdout.on("data", (data) => {
        const result = JSON.parse(data.toString());
        res.json(result); // Send response back to client
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
        res.status(500).json({ error: "Internal Server Error" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
