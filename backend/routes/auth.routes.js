const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate.middleware');

// Validation rules
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Please enter a password with 6 or more characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
    body('password').exists().withMessage('Password is required')
];

// Routes
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);

module.exports = router;
