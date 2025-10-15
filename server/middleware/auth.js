const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and is well-formed
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided or malformed token' });
    }

    const token = authHeader.split(' ')[1];

    // Guard against common bad values
    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ message: 'Invalid token value' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();
    } catch (err) {
        console.error('JWT Error:', err.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
