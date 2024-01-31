import { Application, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import authMiddleware from '../middlewares/Auth';

class RoutesHandler {
    private app: Application;
    private userController = new UserController;
    

    constructor(app: Application){
        this.app = app;
        this.setupRoutes();
        
    }

    private setupRoutes = (): void => {
        this.app.get('/', this.handleRoot);
        this.app.get('/users', authMiddleware.authenticate, this.userController.getAllUsers);
        this.app.get('/users/:id', authMiddleware.authenticate, this.userController.getUserById);
        this.app.post('/users', this.userController.createUser);
        this.app.put('/users/:id', authMiddleware.authenticate, this.userController.updateUser);
        this.app.delete('/users/:id', authMiddleware.authenticate, this.userController.deleteUser);
        this.app.post('/login', this.userController.signinUser);
    }

    private handleRoot = (req: Request, res: Response): void => {
        res.send('Hello World!');
    }
}

export default RoutesHandler;