// __tests__/server.test.ts
import supertest from 'supertest';
import Server from '../server/Server';


const server = Server;
const app = Server.getApp();
const request = supertest(app);

describe('Server root route', () => {
  it('should respond with "Hello World!" at /', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});


