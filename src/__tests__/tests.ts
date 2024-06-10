import { app } from '../app';
import request from "supertest"
import {sequelize} from '../db/db';
import { syncModels } from '../models/syncModel';
import { UserModel } from '../models/UserModel';
import { TodoModel } from '../models/TodoModel';
import { fakeUsers } from './fakes/user';
import { fakeTodos } from './fakes/todos';
describe("GET /api/v1/todos",  () => {

  
beforeAll(async () => {
    try {
    await syncModels()
    await UserModel.bulkCreate(fakeUsers);
    await TodoModel.bulkCreate(fakeTodos);
    }
    catch(err) {
        console.error(err)
    }
  });
  
  afterAll(async () => {
    try {
      await TodoModel.destroy({ where: {} });
      await UserModel.destroy({ where: {} });
      await sequelize.close();
    } catch (err) {
      console.error(err);
    }
  });
  

  it("It should return a JSON file containing the Users Todos", async () => {
    const resp = await request(app).get("/api/v1/user/todos").send({ userId: "c9b1a2b2-4f3e-4aef-998d-1cfa2a431f0c" });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(
      expect.arrayContaining(
        fakeTodos.map(todo => expect.objectContaining({
          id: todo.id,
          description: todo.description,
          title: todo.title,
          isCompleted: todo.isCompleted,
          userId: todo.userId
        }))
      )
    );
  })
  

  it("Should return a 400 error when no userId is provided", async () => {
    const resp = await request(app).get("/api/v1/user/todos")
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe('\"userId\" is required');
  });
  
      

})
