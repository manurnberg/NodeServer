import mongoose, { Connection, ConnectOptions } from "mongoose";
import ConfigurationManager from "../config/ConfigurationManager";

class Database {
    private connection: Connection | null = null;

    async connectDB(): Promise<void> {
        try {
            if(!this.connection){
                const options: ConnectOptions = {
                    autoIndex: true,
                    autoCreate: true
                };
                this.connection = mongoose.connection;
                await this.connection.openUri(ConfigurationManager.getMongoURI(), options);
                console.log('MongoDB Connected');
            }

        } catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error;
        }
    }

    async disconnectDB(): Promise<void> {
        try {
            if(this.connection) {
                await this.connection.close();
                console.log('MongoDB Connection Closed');
            }
        } catch (error) {
            console.error('Error disconnecting from MongoDB', error);
            throw error;
        }
    }
}

export default new Database();
