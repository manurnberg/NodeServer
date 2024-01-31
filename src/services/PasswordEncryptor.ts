import bcrypt from 'bcrypt';

class PasswordEncryptor {

    private readonly saltRounds : number;

    constructor( saltRounds: number = 10) {
        this.saltRounds = saltRounds;
    }

    public hashpassword = async ( password: string ): Promise<string> => {
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            return hashedPassword;
        } catch (error) {
            console.error('Error hashing password:', error);
            throw error;
        }
    }

    public comparePassword = async ( plainPassword: string, hashedPassword: string ): Promise<boolean> => {
        try {
            const isMatch: boolean = await bcrypt.compare(plainPassword, hashedPassword);
            return isMatch
        } catch (error) {
            console.error('Error comparing passwords:', error);
            throw error; 
        }
    }

}

export default new PasswordEncryptor();