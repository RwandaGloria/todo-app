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
const db_1 = __importDefault(require("../db/db"));
describe("GET /api/v1/todos", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield db_1.default;
        }
        catch (err) {
            console.log("Error");
        }
    }));
    it("It should return a JSON file containing the Users Todos", () => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield (0, supertest_1.default)(app_1.app).get("/api/v1/todos");
        expect(resp.status).toBe(200);
        expect(resp.body).toBeInstanceOf(Array);
    }));
});
