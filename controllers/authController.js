// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');

// const generateToken = (id, email) => {
//     return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     try {

//         if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
//             return res.status(200).json({
//                 success: true,
//                 token: generateToken('superadmin_id', email),
//                 user: { name: 'Super Admin', email, role: 'SuperAdmin' }
//             });
//         }

//         const user = await User.findOne({ email }).select('+password');
//         if (user && (await user.matchPassword(password))) {
//             if (!user.isActive) {
//                 return res.status(401).json({ success: false, message: 'Your account is deactivated' });
//             }
//             res.status(200).json({
//                 success: true,
//                 token: generateToken(user._id, user.email),
//                 user: { id: user._id, name: user.name, email: user.email, role: user.role }
//             });
//         } else {
//             res.status(401).json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// const createUser = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const userExists = await User.findOne({ email });
//         if (userExists) {
//             return res.status(400).json({ success: false, message: 'User already exists with this email' });
//         }

//         const user = await User.create({ name, email, password, role });
//         res.status(201).json({
//             success: true,
//             message: 'User created successfully',
//             data: { id: user._id, name: user.name, email: user.email, role: user.role }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// const getUsers = async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.status(200).json({ success: true, count: users.length, data: users });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// const getUserById = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         res.status(200).json({ success: true, data: user });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// const updateUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         user.name = req.body.name || user.name;
//         user.email = req.body.email || user.email;
//         user.role = req.body.role || user.role;
//         if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

//         if (req.body.password) {
//             user.password = req.body.password;
//         }

//         const updatedUser = await user.save();
//         res.status(200).json({
//             success: true,
//             message: 'User updated successfully',
//             data: updatedUser
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };


// const deleteUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }
//         await user.deleteOne();
//         res.status(200).json({ success: true, message: 'User removed from database successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// };

// module.exports = { loginUser, createUser, getUsers, getUserById, updateUser, deleteUser };


const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Token helper function
const generateToken = (id, email) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token (Login)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check Super Admin credentials directly from env
        if (email === process.env.SUPER_ADMIN_EMAIL && password === process.env.SUPER_ADMIN_PASSWORD) {
            return res.status(200).json({
                success: true,
                // Cast Error Fix: Standard 24-character hex format used here
                token: generateToken('600000000000000000000001', email),
                user: { name: 'Super Admin', email, role: 'SuperAdmin' }
            });
        }

        // 2. Database User login path
        const user = await User.findOne({ email }).select('+password');
        if (user && (await user.matchPassword(password))) {
            if (!user.isActive) {
                return res.status(401).json({ success: false, message: 'Your account is deactivated' });
            }
            res.status(200).json({
                success: true,
                token: generateToken(user._id, user.email),
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create new user (CREATE)
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all users (READ ALL)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get single user details (READ SINGLE)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update user details (UPDATE)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        if (req.body.isActive !== undefined) user.isActive = req.body.isActive;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete user account (DELETE)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        await user.deleteOne();
        res.status(200).json({ success: true, message: 'User removed from database successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { loginUser, createUser, getUsers, getUserById, updateUser, deleteUser };

