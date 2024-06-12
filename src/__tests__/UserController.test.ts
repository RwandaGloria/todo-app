import request from 'supertest';
import { app } from '../app';
import { UserService } from '../services/userService';
import { CustomError } from '../types/types';
import { User } from '../types/types';
import { syncModels } from '../models/syncModel';
jest.mock('../services/userService');

describe('AuthController', () => {
  beforeEach(() => {

    jest.clearAllMocks();
  });
  beforeAll(async () => {
    try {

      await syncModels();
      jest.spyOn(console, 'log').mockImplementation(() => {});
  
    } catch (err) {
    }
  });
  describe('signUpController', () => {
    it('should sign up a user successfully', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      };

      const userObj = {
        token: 'fakeToken',
        user: {
          id: 'fakeId',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      };

      (UserService.signUp as jest.MockedFunction<typeof UserService.signUp>).mockResolvedValue(userObj);

      const response = await request(app).post('/api/v1/user/signup').send(body);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        status: 201,
        userObj,
      });
    });

    it('should return 500 if sign up fails', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      };

      (UserService.signUp as jest.MockedFunction<typeof UserService.signUp>).mockResolvedValue(null as never);

      const response = await request(app).post('/api/v1/user/signup').send(body);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Unable to signup user. Please try again later.');
    });

    it('should handle errors during sign up', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
      };

      (UserService.signUp as jest.MockedFunction<typeof UserService.signUp>).mockRejectedValue(new CustomError('Signup error', 400));

      const response = await request(app).post('/api/v1/user/signup').send(body);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Signup error');
    });
  });

  describe('loginController', () => {
    it('should login a user successfully', async () => {
      const body = {
        email: 'john@example.com',
        password: 'password',
      };

      const findUser: User = {
        id: 'fakeId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      };

      const token = 'fakeToken';

      (UserService.login as jest.MockedFunction<typeof UserService.login>).mockResolvedValue({ findUser, token });

      const response = await request(app).post('/api/v1/user/login').send(body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 200,
        user: {
          id: 'fakeId',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
        token,
      });
    });

    it('should return 500 if login fails', async () => {
      const body = {
        email: 'john@example.com',
        password: 'password',
      };

      (UserService.login as jest.MockedFunction<typeof UserService.login>).mockResolvedValue({ findUser: null as unknown as User, token: 'fakeToken' });
      const response = await request(app).post('/api/v1/user/login').send(body);
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Unable to login user. Please try again later');
    });

    it('should handle errors during login', async () => {
      const body = {
        email: 'john@example.com',
        password: 'password',
      };
      (UserService.login as jest.MockedFunction<typeof UserService.login>).mockRejectedValue(new CustomError('Login error', 401));
      const response = await request(app).post('/api/v1/user/login').send(body);
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Login error');
    });
  });
});
