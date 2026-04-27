const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/response');

// Generate JWT Helper
const generateToken = (id, name, email) => {
    return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return sendResponse(res, 409, false, 'Email already exists');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            const token = generateToken(user._id, user.name, user.email);
            
            return sendResponse(res, 201, true, 'User registered successfully', {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error during registration');
    }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user (must select explicitly mapped fields plus password since select: false)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return sendResponse(res, 401, false, 'Invalid credentials');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return sendResponse(res, 401, false, 'Invalid credentials');
        }

        // Generate token
        const token = generateToken(user._id, user.name, user.email);

        return sendResponse(res, 200, true, 'User logged in successfully', {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, 'Server Error during login');
    }
};

module.exports = {
    registerUser,
    loginUser
};
