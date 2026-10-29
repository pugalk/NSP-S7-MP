import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'nsp_portal_super_secure_jwt_secret_2026';

/**
 * Verify JWT Bearer token
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ 
      error: 'Access Denied', 
      message: 'No authorization token provided. Please log in.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ 
      error: 'Invalid Token', 
      message: 'Your session has expired or the token is invalid. Please log in again.' 
    });
  }
};

/**
 * Require specific roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Role "${req.user?.role || 'Guest'}" is not authorized for this resource.`
      });
    }
    next();
  };
};
