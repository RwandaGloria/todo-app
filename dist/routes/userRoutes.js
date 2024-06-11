"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
exports.userRoutes = express_1.default.Router();
const validators_1 = require("../middleware/validators");
const userController_1 = require("../controllers/userController");
exports.userRoutes.post("/signup", validators_1.validateSignUp, userController_1.signUpController);
exports.userRoutes.post("/login", validators_1.validateLogin, userController_1.loginController);
