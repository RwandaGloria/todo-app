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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = require("../models/UserModel");
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const types_1 = require("../types/types");
dotenv_1.default.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
class UserService {
    static signUp(body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, password, email } = body;
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield UserModel_1.UserModel.create({ firstName, lastName, email, password: hashedPassword });
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
                const userWithoutPassword = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                };
                return { token, user: userWithoutPassword };
            }
            catch (error) {
                if (error instanceof sequelize_1.UniqueConstraintError) {
                    throw new types_1.CustomError('User with this email already exists', 409);
                }
                throw new types_1.CustomError('Error creating user', 500);
            }
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.findUserByEmail(email);
                if (!findUser) {
                    throw new types_1.CustomError("User does not exist in our records. Please sign up", 400);
                }
                const isPasswordValid = yield this.comparePassword(password, findUser.password);
                if (!isPasswordValid) {
                    throw new types_1.CustomError("Incorrect Password", 401);
                }
                const token = jsonwebtoken_1.default.sign({ userId: findUser.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
                return { findUser, token };
            }
            catch (error) {
                throw error;
            }
        });
    }
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.findOne({ where: { email } });
                return user;
            }
            catch (error) {
                throw new types_1.CustomError("Error finding user", 500);
            }
        });
    }
    static comparePassword(password, dbPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordValid = yield bcrypt_1.default.compare(password, dbPassword);
            if (!isPasswordValid) {
                throw new types_1.CustomError("Incorrect Password", 401);
            }
            return true;
        });
    }
}
exports.UserService = UserService;
