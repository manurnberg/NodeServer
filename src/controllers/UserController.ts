import { IUserModel } from '../models/User';
import { Request, Response } from "express";
import UserRepository from "../repository/UserRepository";
import passwordEncryptor from '../services/PasswordEncryptor';
import AuthManager from '../services/AuthManager';

class UserController {
    private userRepository = UserRepository;

    constructor(){

    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const users : IUserModel[] = await this.userRepository.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public getUserById = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string =  req.params.id;
            const user: IUserModel | null = await this.userRepository.getUserById(userId);
            user ? res.json(user) : res.status(404).json({ error: 'User not found'});
        } catch (error) {
            console.error('Error getting user by ID:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public createUser = async (req: Request, res: Response): Promise<void> => {
        try {
            
            const newUser: IUserModel = req.body;
            newUser.password = await passwordEncryptor.hashpassword(newUser.password);
            const createduser: IUserModel = await this.userRepository.createUser(newUser)
            res.json(createduser);
        
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: string = req.params.id;
            const updates = req.body;
            if(updates.password){
                updates.password = await passwordEncryptor.hashpassword(updates.password);
            }
            const updateUser: IUserModel | null = await this.userRepository.updateUser(userId, updates); 
            updateUser ? res.json({message: 'User Updated Successfully'}) : res.status(404).json({error: 'User not found'});
            
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id;
            await this.userRepository.deleteUser(userId);
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public signinUser = async (req: Request, res: Response): Promise<void> => {
        const { password, usernameOrEmail } = req.body;
        
        try {
            const user = await this.userRepository.getUserByUsernameOrEmail(usernameOrEmail);
            if(user) {
                const passwordMatch: boolean = await passwordEncryptor.comparePassword(password, user.password);
                passwordMatch ? 

                    res.status(200).json({ message: 'Login Succesfully', token: AuthManager.generateToken({userId: user.id})}) :
                    res.status(401).json({message:'Invalid Password'});
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    
}

export default UserController;