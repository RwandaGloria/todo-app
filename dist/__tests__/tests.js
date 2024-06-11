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
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("../db/db");
const syncModel_1 = require("../models/syncModel");
const UserModel_1 = require("../models/UserModel");
const TodoModel_1 = require("../models/TodoModel");
const user_1 = require("./fakes/user");
const todos_1 = require("./fakes/todos");
const userService_1 = require("../services/userService");
let authToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, syncModel_1.syncModels)();
        yield UserModel_1.UserModel.create(user_1.fakeUsers[0]);
        yield TodoModel_1.TodoModel.bulkCreate(todos_1.fakeTodos);
    }
    catch (err) {
        console.error(err);
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield TodoModel_1.TodoModel.destroy({ where: {} });
        yield UserModel_1.UserModel.destroy({ where: {} });
        yield db_1.sequelize.close();
    }
    catch (err) {
        console.error(err);
    }
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp_ = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/signup").send(user_1.fakeUsers[1]);
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: user_1.fakeUsers[1].email,
            password: user_1.fakeUsers[1].password,
        });
        authToken = resp.body.token;
    }
    catch (err) {
        console.error(err);
    }
}));
afterEach(() => {
    jest.restoreAllMocks();
});
describe("GET /api/v1/user/todos", () => {
    it("It should return a JSON file containing the Users Todos", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`the value of authToken is ${authToken}`);
        const resp = yield (0, supertest_1.default)(app_1.app)
            .get("/api/v1/user/todos")
            .set("Authorization", `Bearer ${authToken}`);
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual(expect.arrayContaining(todos_1.fakeTodos.map((todo) => expect.objectContaining({
            id: todo.id,
            description: todo.description,
            title: todo.title,
            isCompleted: todo.isCompleted,
            userId: todo.userId,
        }))));
    }));
    it("Should return a 400 error when no userId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app)
            .get("/api/v1/user/todos")
            .set("Authorization", `Bearer ${authToken}`);
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe('"userId" is required');
    }));
    it("Should return a 200 status code and an object of a todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomIndex = Math.floor(Math.random() * todos_1.fakeTodos.length);
        const randomId = todos_1.fakeTodos[randomIndex].id;
        const resp = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/v1/user/todos/${randomId}`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            id: randomId,
            description: expect.any(String),
            title: expect.any(String),
            isCompleted: expect.any(Boolean),
            userId: expect.any(String),
        }));
    }));
    it("Should return a 400 error and error message saying the UUID is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app)
            .get(`/api/v1/user/todos/24242sfs`)
            .set("Authorization", `Bearer ${authToken}`);
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe("ID must be a valid UUID");
    }));
});
describe("POST /api/v1/user/todos", () => {
    it("Should create a todo and return a 200 status code with the created Todo", () => __awaiter(void 0, void 0, void 0, function* () {
        const randomIndex = Math.floor(Math.random() * todos_1.fakeTodos.length);
        const randomTitle = todos_1.fakeTodos[randomIndex].title;
        const randomDesc = todos_1.fakeTodos[randomIndex].description;
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/todos").send({
            title: randomTitle,
            description: randomDesc,
        })
            .set("Authorization", `Bearer ${authToken}`);
        expect(resp.status).toBe(201);
        expect(resp.body).toEqual(expect.objectContaining({
            description: expect.any(String),
            title: expect.any(String),
            isCompleted: expect.any(Boolean),
            userId: expect.any(String),
        }));
    }));
});
describe("POST /api/v1/user", () => {
    it("Should sign up a user and return 201 status code, then create the user in the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = user_1.fakeUsers[1];
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/signup").send({
            firstName,
            lastName,
            email,
            password,
        });
        expect(resp.status).toBe(201);
        expect(resp.body).toHaveProperty("status", 201);
        expect(resp.body).toHaveProperty("userObj");
        expect(resp.body.userObj).toHaveProperty("user");
        expect(resp.body.userObj).toHaveProperty("token");
        expect(resp.body.userObj.token).toBeTruthy();
        const createdUser = yield UserModel_1.UserModel.findOne({ where: { email } });
        expect(createdUser).toBeTruthy();
        expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.firstName).toBe(firstName);
        expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.lastName).toBe(lastName);
        expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.email).toBe(email);
    }));
    it("Should login a user and return 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
        const testData = user_1.fakeUsers[1];
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: testData.email,
            password: testData.password,
        });
        expect(resp.status).toBe(200);
        expect(resp.body).toHaveProperty("token");
        expect(resp.body.user).toHaveProperty("email");
        expect(resp.body.user.email).toBe(testData.email);
        expect(resp.body.user).toHaveProperty("firstName");
        expect(resp.body.user).toHaveProperty("lastName");
        expect(resp.body.user).toHaveProperty("id");
    }));
    it("Should return a 400 status code and an error message that the user does not exist in the database", () => __awaiter(void 0, void 0, void 0, function* () {
        const testData = user_1.fakeUsers[2];
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: testData.email,
            password: testData.password,
        });
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe("User does not exist in our records. Please sign up");
    }));
    it("Should return an error message that the user password is incorrect", () => __awaiter(void 0, void 0, void 0, function* () {
        const testData = user_1.fakeUsers[1];
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: testData.email,
            password: "invalid-password",
        });
        expect(resp.status).toBe(401);
        expect(resp.body.message).toBe("Incorrect Password");
    }));
    it("Should return a 400 status and a message that the email was not provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: "Invalid-Email",
            password: "invalid-password",
        });
        expect(resp.status).toBe(400);
        expect(resp.body.message).toBe('"email" must be a valid email');
    }));
    it("Should return a 500 status code and a generic error message when an unhandled exception occurs", () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(userService_1.UserService, "login").mockImplementation(() => {
            throw new Error("Unhandled Exception");
        });
        const resp = yield (0, supertest_1.default)(app_1.app).post("/api/v1/user/login").send({
            email: "test@example.com",
            password: "somepassword",
        });
        expect(resp.status).toBe(500);
        expect(resp.body.message).toBe("Server error occurred. Please try again later");
    }));
});
