const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, '1234567');
        console.log('Token verified:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    // Check if the user is authenticated
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
};

module.exports = { isAuthenticated, isAdmin };
