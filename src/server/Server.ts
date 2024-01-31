import express, { Application } from 'express';
import morgan from 'morgan';
import RoutesHandler from '../routes/RoutesHandler';
import database from '../db/DataBase';
import dotenv from 'dotenv';

dotenv.config();

class Server {
    private app : Application;
    private port : number;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT || '3200', 10);
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares = (): void => {
        this.app.use(express.json());
        this.app.use(morgan('dev'));
    }

    private setupRoutes = (): void => {
        new RoutesHandler(this.app);
    }

    public getApp = (): Application => {
        return this.app;
    }

    public start = (): void => {
        this.app.listen(this.port, () => {
            console.log(`Server running on: http://localhost:3200`);
        });

        process.on('SIGINT', this.handleServerTermination);
    }

    private handleServerTermination = async (): Promise<void> => {
        try {
            console.log('Closing MongoDB connection on app termination');
            await database.disconnectDB();
            process.exit(0);
        } catch (error) {
            console.error('Error handling server termination:', error);
            process.exit(1);
        }
    }

}

export default new Server();
