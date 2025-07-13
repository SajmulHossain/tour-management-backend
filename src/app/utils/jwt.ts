import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = sign(payload, secret, {
        expiresIn
    } as SignOptions)

    return token;
}

export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = verify(token, secret)
    return verifiedToken;
}