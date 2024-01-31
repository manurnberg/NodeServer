import app from '../server/Server';
import database from '../db/DataBase';

class Index {
    private serverInstance;

    constructor() {
        this.serverInstance = app;
    }

    public startServer = async (): Promise<void> => {
        try {
            await database.connectDB();

            this.serverInstance.start();
        } catch (error) {
            console.error('Error starting server: ', error)
        }
    }

}

const index = new Index();
index.startServer();