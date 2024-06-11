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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.signUpController = void 0;
const userService_1 = require("../services/userService");
const types_1 = require("../types/types");
const signUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userObj = yield userService_1.UserService.signUp({ firstName, lastName, email, password });
        if (!userObj) {
            throw new types_1.CustomError("Unable to signup user. Please try again later.", 500);
        }
        return res.status(201).json({
            status: 201,
            userObj
        });
    }
    catch (err) {
        next(err);
    }
});
exports.signUpController = signUpController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { findUser, token } = yield userService_1.UserService.login(email, password);
        if (!findUser) {
            throw new types_1.CustomError("Unable to login user. Please try again later", 500);
        }
        const userWithoutPassword = {
            id: findUser.id,
            firstName: findUser.firstName,
            lastName: findUser.lastName,
            email: findUser.email,
        };
        return res.status(200).json({
            status: 200,
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        next(error);
    }
});
exports.loginController = loginController;
