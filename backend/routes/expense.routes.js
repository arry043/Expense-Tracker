const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
} = require('../controllers/expense.controller');

const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Protect all routes below this line
router.use(protect);

const expenseValidation = [
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isIn([
            'Food', 'Travel', 'Shopping', 'Entertainment', 
            'Health', 'Rent', 'Utilities', 'Education', 'Other'
        ])
        .withMessage('Category must be a valid predefined option'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO8601 string'),
    body('note')
        .optional()
        .isLength({ max: 200 })
        .withMessage('Note must be less than 200 characters')
];

// /api/expenses routes
router.route('/')
    .get(getExpenses)
    .post(expenseValidation, validate, addExpense);

router.get('/summary', getExpenseSummary);

router.route('/:id')
    .put(expenseValidation, validate, updateExpense)
    .delete(deleteExpense);

module.exports = router;
