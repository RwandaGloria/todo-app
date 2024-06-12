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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const userService_1 = require("../services/userService");
const types_1 = require("../types/types");
const syncModel_1 = require("../models/syncModel");
jest.mock('../services/userService');
describe('AuthController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, syncModel_1.syncModels)();
            jest.spyOn(console, 'log').mockImplementation(() => { });
        }
        catch (err) {
        }
    }));
    describe('signUpController', () => {
        it('should sign up a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
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
            userService_1.UserService.signUp.mockResolvedValue(userObj);
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/signup').send(body);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                status: 201,
                userObj,
            });
        }));
        it('should return 500 if sign up fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password',
            };
            userService_1.UserService.signUp.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/signup').send(body);
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Unable to signup user. Please try again later.');
        }));
        it('should handle errors during sign up', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password',
            };
            userService_1.UserService.signUp.mockRejectedValue(new types_1.CustomError('Signup error', 400));
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/signup').send(body);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Signup error');
        }));
    });
    describe('loginController', () => {
        it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                email: 'john@example.com',
                password: 'password',
            };
            const findUser = {
                id: 'fakeId',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            };
            const token = 'fakeToken';
            userService_1.UserService.login.mockResolvedValue({ findUser, token });
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/login').send(body);
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
        }));
        it('should return 500 if login fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                email: 'john@example.com',
                password: 'password',
            };
            userService_1.UserService.login.mockResolvedValue({ findUser: null, token: 'fakeToken' });
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/login').send(body);
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Unable to login user. Please try again later');
        }));
        it('should handle errors during login', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                email: 'john@example.com',
                password: 'password',
            };
            userService_1.UserService.login.mockRejectedValue(new types_1.CustomError('Login error', 401));
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/v1/user/login').send(body);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Login error');
        }));
    });
});
