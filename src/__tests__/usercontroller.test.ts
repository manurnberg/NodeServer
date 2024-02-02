import supertest from 'supertest';
import Server from '../server/Server';
import AuthManager from '../services/AuthManager';
import dotenv from 'dotenv';
import DataBaseManager from '../config/TestDataBaseConfig';
import { IUserModel } from '../models/User';

dotenv.config({ path: '.env.test' });

const app = Server.getApp();
const request = supertest(app);

describe(' UserController ', () => {
    beforeAll(async () => {
        await DataBaseManager.initialize();
        await DataBaseManager.connect();
        await DataBaseManager.insertTestData();
    });
    afterAll(async () => {
        await DataBaseManager.clearDatabase();
        await DataBaseManager.closeDatabase();
    });

    it('should get all users', async () => {
        const authToken = AuthManager.generateToken({userId: '65b80f79c14d6915c9e83480'});
        
    
        const response = await request.get('/users').set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {  email: 'usuario1@example.com', id: response.body[0].id, username: 'usuario1'},
            {  email: 'usuario2@example.com', id: response.body[1].id, username: 'usuario2'},
        ]);

    })

    it('should create a new user', async () => {
            const response = await request.post('/users')
                .send({
                    username: 'nuevoUsuario',
                    email: 'nuevoUsuario@example.com',
                    password: 'nuevaContraseña'
                });

        let createdUser = response.body;

        expect(response.status).toBe(200);
        expect(createdUser.username).toBe('nuevoUsuario');
        expect(createdUser.email).toBe('nuevoUsuario@example.com');
    });

    it('should get a specific user by his ID', async () => {
        const dummyUser = await dummyUserCreator();
        const userId = dummyUser.id
        const authToken = dummyTokenGenerator(userId)

        const response = await request.get(`/users/${userId}`).set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({username: 'testUser', email: 'test@example.com', id: response.body.id});

    });

    it('should update a specific users data', async () => {
        const dummyUser = await dummyUserCreator();
        const userId = dummyUser.id
        const authToken = dummyTokenGenerator(userId)

        const response = await request.put(`/users/${userId}`)
        .send({
            username: 'testuser1'
        })
        .set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('User Updated Successfully');

    });

    it('should delete a specific user', async () => {
        const dummyUser = await dummyUserCreator();
        const userId = dummyUser.id
        const authToken = dummyTokenGenerator(userId)

        const response = await request.delete(`/users/${userId}`)
        .set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('User deleted successfully');
    });

    it('should login a user that was registered', async () => {
        const dummyUser = await dummyUserCreator();
        const authToken = dummyTokenGenerator(dummyUser.id);

        const response = await request
        .post('/login')
        .send({
            usernameOrEmail: `${dummyUser.email}`,
            password:'password'
        })
        .set('Authorization', `${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Login Succesfully');

    })

    const dummyUserCreator = async (): Promise<IUserModel> => {
        const userToInsert = { username: 'testUser', email: 'test@example.com', password: 'password' };
        const insertedUserResponse = await supertest(app)
        .post('/users')
        .send(userToInsert);

        return insertedUserResponse.body;
    }

    const dummyTokenGenerator = (userId: string): string => {
        return AuthManager.generateToken({userId: userId});
    }

    
})