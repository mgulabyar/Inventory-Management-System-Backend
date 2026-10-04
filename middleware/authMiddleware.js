const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access Denied! No token provided.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.email === process.env.SUPER_ADMIN_EMAIL) {
            req.user = { 
                id: 'superadmin_id', 
                name: 'Super Admin', 
                email: decoded.email, 
                role: 'SuperAdmin' 
            };
            return next();
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'User account disabled or not found!' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token!' 
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && req.user.role === 'SuperAdmin') {
            return next();
        }

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Your role '${req.user ? req.user.role : 'None'}' is not authorized to access this feature!` 
            });
        }
        next();
    };
};
