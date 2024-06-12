import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import { UserService } from "../services/userService";
import { CustomError } from "../types/types";

// Spying on bcrypt.hash
jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

// Spying on bcrypt.compare
jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

// Spying on jwt.sign
jest.spyOn(jwt, 'sign').mockReturnValue('fakeToken' as never);

describe('UserService', () => {
  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      const body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password'
      };
      const result = await UserService.signUp(body);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword'
      });
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 'fakeId' }, expect.any(String), { expiresIn: '1h' });
      expect(result).toEqual({
        token: 'fakeToken',
        user: {
          id: 'fakeId',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
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
      })).rejects.toThrow(new CustomError('User with this email already exists', 409));
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
      } as UserModel; // Cast the object to UserModel
      jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(findUser);
      const result = await UserService.login('john@example.com', 'password');
      expect(UserService.findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalledWith({ userId: 'fakeId' }, expect.any(String), { expiresIn: '1h' });
      expect(result).toEqual({
        findUser,
        token: 'fakeToken'
      });
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
      jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(findUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);
      await expect(UserService.login('john@example.com', 'password')).rejects.toThrow(new CustomError('Incorrect Password', 401));
    });

    it('should throw an error if an unexpected error occurs during login', async () => {
      jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(new Error('Unexpected error'));
      await expect(UserService.login('john@example.com', 'password')).rejects.toThrow(new CustomError('Error finding user', 500));
    });
  });
});
