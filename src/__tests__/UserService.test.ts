import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/userService";
import { TodoModel } from "../models/TodoModel";
import { CustomError } from "../types/types";


beforeAll(() => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
});

jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/UserModel");
describe('UserService', () => {
  describe('signUp', () => {
    it("should sign up a user successfully", async () => {
        const body = {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password"
        };
        const user = {
          id: "fakeId",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "hashedPassword"
        };
        const expectedToken = "fakeToken";
  
        (bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>).mockResolvedValue("hashedPassword" as never);
        (UserModel.create as jest.MockedFunction<typeof UserModel.create>).mockResolvedValue(user);
        (jwt.sign as jest.MockedFunction<typeof jwt.sign>).mockReturnValue(expectedToken as never) ;
  
        const result = await UserService.signUp(body);
  
        expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
        expect(UserModel.create).toHaveBeenCalledWith({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "hashedPassword"
        });
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: "fakeId" },
          expect.any(String),
          { expiresIn: "1h" }
        );
        expect(result).toEqual({
          token: expectedToken,
          user: {
            id: "fakeId",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com"
          }
        });
      });
  
    it('should throw an error if user with the same email already exists', async () => {
      jest.spyOn(UserModel, 'create').mockRejectedValueOnce(new CustomError('User with this email already exists', 409));
      await expect(UserService.signUp({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password'
      })).rejects.toThrow(new CustomError('Error creating user', 500));
    });
    it('should throw an error if an unexpected error occurs during sign up', async () => {
      jest.spyOn(UserModel, 'create').mockRejectedValueOnce(new Error('Unexpected error'));
      await expect(UserService.signUp({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password'
      })).rejects.toThrow(new CustomError('Error creating user', 500));
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
        const findUser = {
          id: 'fakeId',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashedPassword'
        } as UserModel; 
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(findUser);
        const result = await UserService.login('john@example.com', 'password');
        expect(UserModel.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
        expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith({ userId: 'fakeId' }, expect.any(String), { expiresIn: '1h' });
      });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
      await expect(UserService.login('john@example.com', 'password')).rejects.toThrow(new CustomError('User does not exist in our records. Please sign up', 400));
    });
    it('should throw an error if password is incorrect', async () => {
        const findUser = {
          id: 'fakeId',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashedPassword'
        } as UserModel;
        
        // Mocking comparePassword to return false (incorrect password)
        jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(findUser);
        jest.spyOn(UserService, 'comparePassword').mockResolvedValueOnce(false as never);
        
        await expect(UserService.login('john@example.com', 'incorrectPassword')).rejects.toThrow(new CustomError('Incorrect Password', 401));
      });
    it("should throw an error if user with the same email already exists", async () => {
        const body = {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "password"
        };
        UserModel.create = jest.fn().mockRejectedValueOnce(new UniqueConstraintError({}));
        await expect(UserService.signUp(body)).rejects.toThrow(
          new CustomError("User with this email already exists", 409)
        );
      });
    it('should throw an error if an unexpected error occurs during login', async () => {
      jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(new Error('Unexpected error'));
      await expect(UserService.login('john@example.com', 'password')).rejects.toThrow(new CustomError('Error finding user', 500));
    });
  });
});
describe('comparePassword', () => {
    it('should return true if the password is valid', async () => {
      const password = 'password';
      const dbPassword = 'hashedPassword';
      
      (bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>).mockResolvedValue(true as never);
      
      const result = await UserService.comparePassword(password, dbPassword);
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, dbPassword);
      expect(result).toBe(true);
    });

    it('should throw a CustomError if the password is invalid', async () => {
      const password = 'password';
      const dbPassword = 'hashedPassword';
      
      (bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>).mockResolvedValue(false as never);
      
      await expect(UserService.comparePassword(password, dbPassword)).rejects.toThrow(new CustomError('Incorrect Password', 401));
      
      expect(bcrypt.compare).toHaveBeenCalledWith(password, dbPassword);
    });
  });

