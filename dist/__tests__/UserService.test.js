"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const UserModel_1 = require("../models/UserModel");
const userService_1 = require("../services/userService");
const types_1 = require("../types/types");
beforeAll(() => {
    jest.spyOn(bcrypt_1.default, 'hash').mockResolvedValue('hashedPassword');
    jest.spyOn(bcrypt_1.default, 'compare').mockResolvedValue(true);
    jest.spyOn(jsonwebtoken_1.default, 'sign').mockReturnValue('fakeToken');
});
afterAll(() => {
    jest.restoreAllMocks();
});
jest.spyOn(bcrypt_1.default, 'hash').mockResolvedValue('hashedPassword');
jest.spyOn(bcrypt_1.default, 'compare').mockResolvedValue(true);
jest.spyOn(jsonwebtoken_1.default, 'sign').mockReturnValue('fakeToken');
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../models/UserModel");
describe('UserService', () => {
    describe('signUp', () => {
        it("should sign up a user successfully", () => __awaiter(void 0, void 0, void 0, function* () {
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
            bcrypt_1.default.hash.mockResolvedValue("hashedPassword");
            UserModel_1.UserModel.create.mockResolvedValue(user);
            jsonwebtoken_1.default.sign.mockReturnValue(expectedToken);
            const result = yield userService_1.UserService.signUp(body);
            expect(bcrypt_1.default.hash).toHaveBeenCalledWith("password", 10);
            expect(UserModel_1.UserModel.create).toHaveBeenCalledWith({
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "hashedPassword"
            });
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ userId: "fakeId" }, expect.any(String), { expiresIn: "1h" });
            expect(result).toEqual({
                token: expectedToken,
                user: {
                    id: "fakeId",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john@example.com"
                }
            });
        }));
        it('should throw an error if user with the same email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserModel_1.UserModel, 'create').mockRejectedValueOnce(new types_1.CustomError('User with this email already exists', 409));
            yield expect(userService_1.UserService.signUp({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password'
            })).rejects.toThrow(new types_1.CustomError('Error creating user', 500));
        }));
        it('should throw an error if an unexpected error occurs during sign up', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserModel_1.UserModel, 'create').mockRejectedValueOnce(new Error('Unexpected error'));
            yield expect(userService_1.UserService.signUp({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password'
            })).rejects.toThrow(new types_1.CustomError('Error creating user', 500));
        }));
    });
    describe('login', () => {
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const findUser = {
                id: 'fakeId',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword'
            };
            jest.spyOn(UserModel_1.UserModel, 'findOne').mockResolvedValueOnce(findUser);
            const result = yield userService_1.UserService.login('john@example.com', 'password');
            expect(UserModel_1.UserModel.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
            expect(bcrypt_1.default.compare).toHaveBeenCalledWith('password', 'hashedPassword');
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ userId: 'fakeId' }, expect.any(String), { expiresIn: '1h' });
        }));
        it('should throw an error if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserModel_1.UserModel, 'findOne').mockResolvedValueOnce(null);
            yield expect(userService_1.UserService.login('john@example.com', 'password')).rejects.toThrow(new types_1.CustomError('User does not exist in our records. Please sign up', 400));
        }));
        it('should throw an error if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            const findUser = {
                id: 'fakeId',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword'
            };
            jest.spyOn(UserModel_1.UserModel, 'findOne').mockResolvedValueOnce(findUser);
            jest.spyOn(userService_1.UserService, 'comparePassword').mockResolvedValueOnce(false);
            yield expect(userService_1.UserService.login('john@example.com', 'incorrectPassword')).rejects.toThrow(new types_1.CustomError('Incorrect Password', 401));
        }));
        it("should throw an error if user with the same email already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                password: "password"
            };
            UserModel_1.UserModel.create = jest.fn().mockRejectedValueOnce(new sequelize_1.UniqueConstraintError({}));
            yield expect(userService_1.UserService.signUp(body)).rejects.toThrow(new types_1.CustomError("User with this email already exists", 409));
        }));
        it('should throw an error if an unexpected error occurs during login', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(UserModel_1.UserModel, 'findOne').mockRejectedValueOnce(new Error('Unexpected error'));
            yield expect(userService_1.UserService.login('john@example.com', 'password')).rejects.toThrow(new types_1.CustomError('Error finding user', 500));
        }));
    });
});
describe('comparePassword', () => {
    it('should return true if the password is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'password';
        const dbPassword = 'hashedPassword';
        bcrypt_1.default.compare.mockResolvedValue(true);
        const result = yield userService_1.UserService.comparePassword(password, dbPassword);
        expect(bcrypt_1.default.compare).toHaveBeenCalledWith(password, dbPassword);
        expect(result).toBe(true);
    }));
    it('should throw a CustomError if the password is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'password';
        const dbPassword = 'hashedPassword';
        bcrypt_1.default.compare.mockResolvedValue(false);
        yield expect(userService_1.UserService.comparePassword(password, dbPassword)).rejects.toThrow(new types_1.CustomError('Incorrect Password', 401));
        expect(bcrypt_1.default.compare).toHaveBeenCalledWith(password, dbPassword);
    }));
});
