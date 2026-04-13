"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateToken = void 0;
const jwt_1 = require("../utils/jwt");
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];
        if (!token) {
            console.error("Error verifying token");
            res.status(401).json({ error: "Invalid token" });
            return res.status(401).json({ meesage: "Not authenticated" });
        }
        const payload = await (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        console.log("Error verifying token", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticateToken = authenticateToken;
const authorizeAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Admins only" });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=auth.js.map