import dotenv from 'dotenv';

dotenv.config();

class ConfigurationManager {
    private mongoURI: string;

     constructor(){
        const env = process.env.NODE_ENV || 'development';

        const devConfg = {
            mongoURI : 'mongodb://localhost:37017/node-poo'
        };

        const testConfig = {
            mongoURI : 'mongodb://localhost:37017/node-poo-test'
        };

        const selectedConfig = env === 'test' ? testConfig : devConfg;

        this.mongoURI = selectedConfig.mongoURI;
     }

     public getMongoURI = (): string => {
        return this.mongoURI;
     }
}

export default new ConfigurationManager();