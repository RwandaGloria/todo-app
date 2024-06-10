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
describe("GET /api/v1/todos", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, syncModel_1.syncModels)();
            yield UserModel_1.UserModel.bulkCreate(user_1.fakeUsers);
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
    it("It should return a JSON file containing the Users Todos", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app).get("/api/v1/user/todos").send({ userId: "c9b1a2b2-4f3e-4aef-998d-1cfa2a431f0c" });
        expect(resp.status).toBe(200);
        expect(resp.body).toEqual(expect.arrayContaining(todos_1.fakeTodos.map(todo => expect.objectContaining({
            id: todo.id,
            description: todo.description,
            title: todo.title,
            isCompleted: todo.isCompleted,
            userId: todo.userId
        }))));
    }));
    it("Should return a 400 error when no userId is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app).get("/api/v1/user/todos");
        expect(resp.status).toBe(400);
        console.error(resp.body);
    }));
});
