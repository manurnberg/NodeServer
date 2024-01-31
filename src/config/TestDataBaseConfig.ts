import mongoose, { Mongoose } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import ConfigurationManager from "./ConfigurationManager";
import User from "../models/User";


class DataBaseManager {

    private mongod: MongoMemoryServer | undefined;
    private mongooseInstance: Mongoose;
    private isServerRunning: boolean = false;

    constructor(){
        this.mongooseInstance = mongoose;   
    }

    public initialize = async (): Promise<void> => {
        if (!this.mongod || !this.isServerRunning) {
        this.mongod = await MongoMemoryServer.create({
            instance: {
                port: 37017,
                dbName: 'node-poo-test',
                storageEngine: 'ephemeralForTest'
            }
        });
        }
        this.isServerRunning = true;
    }

    public insertTestData = async (): Promise<void> => {
        try {
            if (!this.mongod) {
                throw new Error('MongoMemoryServer not initialized. Call initialize() before connect().');
            }

            const userModel = User.getModel();

            await userModel.create([
                { username: 'usuario1', email: 'usuario1@example.com', password: 'contraseña1' },
                { username: 'usuario2', email: 'usuario2@example.com', password: 'contraseña2' },
            ]);

        } catch (error) {
            console.error('Error inserting test data into MongoDB:', error);
            throw error;
        }
    }

    public clearDatabase = async (): Promise<void> => {
        try {
            if (!this.mongod) {
                throw new Error('MongoMemoryServer not initialized. Call initialize() before connect().');
            }
            
            const collections = this.mongooseInstance.connection.collections;

            for (const key in collections) {
                if(Object.prototype.hasOwnProperty.call(collections, key)) {
                    const collection = collections[key];
                    await collection.deleteMany({});
                }
            }
        } catch (error) {
            console.error('Error clearing the database:', error);
            throw error;
        }
    }

    public connect = async (): Promise<void> => {
        try {
            if (!this.mongod) {
                throw new Error('MongoMemoryServer not initialized. Call initialize() before connect().');
            }

            if(process.env.NODE_ENV === 'test'){
                await this.mongod.ensureInstance();
                const uri = this.mongod.getUri();
                await this.mongooseInstance.connect(uri);
            } else {
                const uri = ConfigurationManager.getMongoURI();
                this.mongooseInstance.connect(uri);
            }
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    public closeDatabase = async (): Promise<void> => {
        try {
            if (!this.mongod) {
                throw new Error('MongoMemoryServer not initialized. Call initialize() before connect().');
            }

            this.mongooseInstance.disconnect();

            if(process.env.NODE_ENV === 'test' && this.isServerRunning){
                this.mongod.stop();
                this.isServerRunning = false;
                console.log('MongoMemoryServer stopped')
            }
            
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
}

export default new DataBaseManager();


