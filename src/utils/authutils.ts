import jwt, { Jwt } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
export function TokenGeneration(userID: string) {
    const token = jwt.sign(
        {userID},
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h"
        }
    )
    return token;
}

export function jwtTokenVerification(token: string) {
    const verified = jwt.verify(
        token,
        process.env.JWT_SECRET!
    )
    return verified;
}