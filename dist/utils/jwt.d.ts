import { JWTPayload as JoseJWTPayload } from "jose";
export interface JWTPayload extends JoseJWTPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}
export declare const generateToken: (payload: JWTPayload) => Promise<string>;
export declare const verifyToken: (token: string) => Promise<JWTPayload>;
//# sourceMappingURL=jwt.d.ts.map