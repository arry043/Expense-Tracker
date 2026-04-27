const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be a positive number']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Food', 
            'Travel', 
            'Shopping', 
            'Entertainment', 
            'Health', 
            'Rent', 
            'Utilities', 
            'Education', 
            'Other'
        ]
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now
    },
    note: {
        type: String,
        trim: true,
        maxLength: [200, 'Note cannot be more than 200 characters']
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

// Compound index for performance since we'll frequently query by user and date
expenseSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
