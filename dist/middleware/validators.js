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
exports.validateUpdateTodo = exports.validateDeleteTodo = exports.validateLogin = exports.validateSignUp = exports.validateCreateTodo = exports.validateGetTodo = exports.validateGetAllTodos = void 0;
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types/types");
const validateGetAllTodos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object().keys({
        userId: joi_1.default.string().uuid().required(),
    });
    const { error } = yield schema.validate(req.body);
    if (error) {
        return next(new types_1.CustomError(error.details[0].message, 400));
    }
    next();
});
exports.validateGetAllTodos = validateGetAllTodos;
const validateGetTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const getTodoSchema = joi_1.default.object({
        id: joi_1.default.string().uuid().required().messages({
            'string.base': 'ID must be a string',
            'string.empty': 'ID cannot be empty',
            'string.guid': 'ID must be a valid UUID',
            'any.required': 'ID is required',
        }),
    });
    const { error } = getTodoSchema.validate(req.params);
    if (error) {
        return next(new types_1.CustomError(error.details[0].message, 400));
    }
    next();
});
exports.validateGetTodo = validateGetTodo;
const validateCreateTodo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const createTodoSchema = joi_1.default.object().keys({
        title: joi_1.default.string().required().label("Title"),
        description: joi_1.default.string().required().label("Description"),
    });
    const { error } = yield createTodoSchema.validate(req.body);
    if (error) {
        return next(new types_1.CustomError(error.details[0].message, 400));
    }
    next();
});
exports.validateCreateTodo = validateCreateTodo;
const validateSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().required(),
        lastName: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return next(new types_1.CustomError(error.details[0].message, 400));
    }
    next();
});
exports.validateSignUp = validateSignUp;
const validateLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return next(new types_1.CustomError(error.details[0].message, 400));
    }
    next();
});
exports.validateLogin = validateLogin;
const validateDeleteTodo = (req, res, next) => {
    const deleteTodoSchema = joi_1.default.object({
        id: joi_1.default.string().guid().required(),
    });
    const { error } = deleteTodoSchema.validate(req.params);
    if (error) {
        return next(new types_1.CustomError("Invalid Request Parameters", 400));
    }
    next();
};
exports.validateDeleteTodo = validateDeleteTodo;
const validateUpdateTodo = (req, res, next) => {
    const paramsSchema = joi_1.default.object({
        id: joi_1.default.string().guid().required(),
    });
    const bodySchema = joi_1.default.object({
        title: joi_1.default.string().optional(),
        description: joi_1.default.string().optional(),
        isCompleted: joi_1.default.boolean().optional(),
    }).or('title', 'description', 'isCompleted');
    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        return next(new types_1.CustomError("Invalid Request Parameters", 400));
    }
    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return next(new types_1.CustomError("Invalid Request Body: At least one of title, description, or isCompleted must be provided", 400));
    }
    next();
};
exports.validateUpdateTodo = validateUpdateTodo;
