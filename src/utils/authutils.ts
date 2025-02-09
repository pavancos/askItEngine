import jwt, { Jwt } from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();
export function TokenGeneration(user : any) {
    const email = user.email as string;
    const id = user._id as string;
    const token = jwt.sign(
        {
            email, id
        },
        process.env.JWT_SECRET!
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