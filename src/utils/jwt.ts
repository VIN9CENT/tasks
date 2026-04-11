import { createSecretKey } from "node:crypto";
import { SignJWT, JWTPayload as JoseJWTPayload, jwtVerify,} from "jose";

export interface JWTPayload extends JoseJWTPayload {
  id: string;
  name: string;
  email: string;
}
const secret = process.env.JWT_SECRET!;
 if (!secret) {
    throw new Error("JWT_SECRET environment variable not set");
  }
const secretKey = createSecretKey(secret, "utf-8");
export const generateToken = async (payload: JWTPayload): Promise<string> => {
 

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
    .sign(secretKey);
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  const {payload} = await jwtVerify(token, secretKey);
  return payload as JWTPayload
};
