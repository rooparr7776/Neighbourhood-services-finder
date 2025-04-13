const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get('/', (req, res) => {
    res.send("API is running...");
});

// Connect to MongoDB and Start Server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
        });
    })
    .catch((err) => console.error("❌ MongoDB Error:", err));
