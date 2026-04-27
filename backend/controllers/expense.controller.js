const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const { sendResponse } = require('../utils/response');

/**
 * @desc    Get all expenses of logged-in user
 * @route   GET /api/expenses
 * @access  Private
 */
const getExpenses = async (req, res) => {
    try {
        const { month, year, category } = req.query;
        let query = { userId: req.user.id };

        // Filtering logic
        if (category) {
            query.category = category;
        }

        if (month || year) {
            // Need both month and year for accurate filtering
            const targetYear = year ? parseInt(year) : new Date().getFullYear();
            
            if (month) {
                const targetMonth = parseInt(month) - 1; // 0-indexed in JS dates
                const startDate = new Date(targetYear, targetMonth, 1);
                const endDate = new Date(targetYear, targetMonth + 1, 0); // Last day of month
                
                query.date = {
                    $gte: startDate,
                    $lte: endDate
                };
            } else {
                const startDate = new Date(targetYear, 0, 1);
                const endDate = new Date(targetYear, 11, 31);
                
                query.date = {
                    $gte: startDate,
                    $lte: endDate
                };
            }
        }

        const expenses = await Expense.find(query).sort({ date: -1 });

        // Calculate total for these expenses
        const total = expenses.reduce((acc, current) => acc + current.amount, 0);

        return sendResponse(res, 200, true, 'Expenses fetched', { 
            expenses, 
            total 
        });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error fetching expenses');
    }
};

/**
 * @desc    Add a new expense
 * @route   POST /api/expenses
 * @access  Private
 */
const addExpense = async (req, res) => {
    try {
        const { amount, category, date, note } = req.body;

        const expense = await Expense.create({
            userId: req.user.id,
            amount,
            category,
            date: date ? new Date(date) : undefined,
            note
        });

        return sendResponse(res, 201, true, 'Expense added', { expense });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error adding expense');
    }
};

/**
 * @desc    Update an existing expense
 * @route   PUT /api/expenses/:id
 * @access  Private
 */
const updateExpense = async (req, res) => {
    try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return sendResponse(res, 400, false, 'Invalid expense ID');
        }

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return sendResponse(res, 404, false, 'Expense not found');
        }

        // Ownership check - crucial security step
        if (expense.userId.toString() !== req.user.id) {
            return sendResponse(res, 403, false, 'Not authorized to update this expense');
        }

        // Update
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        return sendResponse(res, 200, true, 'Expense updated', { expense: updatedExpense });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error updating expense');
    }
};

/**
 * @desc    Delete an expense
 * @route   DELETE /api/expenses/:id
 * @access  Private
 */
const deleteExpense = async (req, res) => {
    try {
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return sendResponse(res, 400, false, 'Invalid expense ID');
        }

        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return sendResponse(res, 404, false, 'Expense not found');
        }

        // Ownership check - crucial security step
        if (expense.userId.toString() !== req.user.id) {
            return sendResponse(res, 403, false, 'Not authorized to delete this expense');
        }

        // Using findByIdAndDelete instead of remove() to match modern mongoose
        await Expense.findByIdAndDelete(req.params.id);

        return sendResponse(res, 200, true, 'Expense deleted successfully');
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error deleting expense');
    }
};

/**
 * @desc    Get category-wise aggregated summary
 * @route   GET /api/expenses/summary
 * @access  Private
 */
const getExpenseSummary = async (req, res) => {
    try {
        // Aggregation pipeline to group user's expenses by category
        const summary = await Expense.aggregate([
            { 
                $match: { userId: new mongoose.Types.ObjectId(req.user.id) } 
            },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    total: 1,
                    count: 1
                }
            },
            { $sort: { total: -1 } }
        ]);

        // Calculate grand total from summary
        const grandTotal = summary.reduce((acc, curr) => acc + curr.total, 0);

        return sendResponse(res, 200, true, 'Summary fetched', {
            summary,
            grandTotal
        });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error fetching summary');
    }
};

module.exports = {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
};
