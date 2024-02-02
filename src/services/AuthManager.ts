import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
}

class AuthManager {
    protected static secretKey: string = 'clavesecreta123456';

    public static generateToken = (payload: TokenPayload): string => {
        return jwt.sign(payload, this.secretKey, { expiresIn: '1h'});
    }
}

export default AuthManager;