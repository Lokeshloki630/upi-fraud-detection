import axios from "axios";
import React, { useState } from "react";
import "../components/FraudDetection.css"; // Import the CSS file

const FraudDetection = () => {
    const [formData, setFormData] = useState({
        TransactionID: "",
        Amount: "",
        Latitude: "",
        Longitude: "",
        AvgTransactionAmount: "",
        TransactionFrequency: "",
        FailedAttempts: "",
        PhoneNumber: ""
    });

    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/predict", formData);
            setResult(response.data.fraud_prediction);
        } catch (error) {
            console.error("Error:", error);
            setResult("Error detecting fraud");
        }
    };

    return (
        <div className="fraud-container">
            <h2 className="title">
                <span className="icon">💳</span> UPI Fraud Detection
            </h2>

            <form className="fraud-form" onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key} className="input-group">
                        <input
                            type="text"
                            name={key}
                            placeholder={key}
                            value={formData[key]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <button className="submit-btn" type="submit">🔍 Check Fraud</button>
            </form>
            {result !== null && (
                <h3 className={`fraud-result ${result === 1 ? "fraud" : "no-fraud"}`}>
                    {result === 1 ? "⚠️ Fraud Detected!" : "✅ No Fraud Detected"}
                </h3>
            )}
        </div>
    );
};

export default FraudDetection;
