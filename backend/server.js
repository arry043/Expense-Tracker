require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api', (req, res) => {
    res.json({ success: true, message: 'Expense Tracker API is running...' });
});

// Routes will be imported here
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/expenses', require('./routes/expense.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        errors: process.env.NODE_ENV === 'production' ? null : [err.stack]
    });
});

// Fallback for unhandled routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
