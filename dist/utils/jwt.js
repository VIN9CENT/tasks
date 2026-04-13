"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const node_crypto_1 = require("node:crypto");
const jose_1 = require("jose");
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET environment variable not set");
}
const secretKey = (0, node_crypto_1.createSecretKey)(secret, "utf-8");
const generateToken = async (payload) => {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
        .sign(secretKey);
};
exports.generateToken = generateToken;
const verifyToken = async (token) => {
    const { payload } = await (0, jose_1.jwtVerify)(token, secretKey);
    return payload;
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map