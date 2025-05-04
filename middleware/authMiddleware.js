const jwt = require("jsonwebtoken");

const authMiddleware = (roles) => (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log('user', req.user);  // req.user is not yet set at this point
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);  // Now this will print user role correctly
    console.log("Allowed Roles:", roles);

    // Automatically allow superadmin to access all protected routes
    if (decoded.role === "superadmin" || (roles && roles.includes(decoded.role))) {
      req.user = decoded;
      return next();
    }

    return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
