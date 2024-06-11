import { app } from "../app";
import request from "supertest";
import { sequelize } from "../db/db";
import { syncModels } from "../models/syncModel";
import { UserModel } from "../models/UserModel";
import { TodoModel } from "../models/TodoModel";
import { fakeUsers } from "./fakes/user";
import { fakeTodos } from "./fakes/todos";
import { UserService } from "../services/userService";
import {TodoService} from "../services/todoService";
import { UUID } from "sequelize";
import { string } from "joi";

let authToken: string;
let createdTodoId: string;

beforeAll(async () => {
  try {
    await syncModels();
    await UserModel.create(fakeUsers[0]);
    await TodoModel.bulkCreate(fakeTodos);
  } catch (err) {
    console.error(err);
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
beforeEach(async () => {
  try {
    const resp_ = await request(app)
      .post("/api/v1/user/signup")
      .send(fakeUsers[1]);
    const resp = await request(app).post("/api/v1/user/login").send({
      email: fakeUsers[1].email,
      password: fakeUsers[1].password,
    });
    authToken = resp.body.token;
  } catch (err) {
    console.error(err);
  }
});
afterEach(() => {
  jest.restoreAllMocks();
});

describe("POST /api/v1/user", () => {
  it("Should sign up a user and return 201 status code, then create the user in the database", async () => {
    const { firstName, lastName, email, password } = fakeUsers[2];
    const resp = await request(app).post("/api/v1/user/signup").send({
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
    const createdUser = await UserModel.findOne({ where: { email } });
    expect(createdUser).toBeTruthy();
    expect(createdUser?.firstName).toBe(firstName);
    expect(createdUser?.lastName).toBe(lastName);
    expect(createdUser?.email).toBe(email);
  });

  it("Should login a user and return 200 status", async () => {
    const testData = fakeUsers[1];
    const resp = await request(app).post("/api/v1/user/login").send({
      email: testData.email,
      password: testData.password,
    });

    expect(resp.status).toBe(200);
    expect(resp.body).toHaveProperty("token");
    expect(resp.body.user).toHaveProperty("email"); // Access email property under user
    expect(resp.body.user.email).toBe(testData.email); // Validate email value
    expect(resp.body.user).toHaveProperty("firstName");
    expect(resp.body.user).toHaveProperty("lastName");
    expect(resp.body.user).toHaveProperty("id");
  });

  it("Should return a 400 status code and an error message that the user does not exist in the database", async () => {
    const testData = fakeUsers[3];
    const resp = await request(app).post("/api/v1/user/login").send({
      email: testData.email,
      password: testData.password,
    });
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe(
      "User does not exist in our records. Please sign up"
    );
  });
  it("Should return an error message that the user password is incorrect", async () => {
    const testData = fakeUsers[1];
    const resp = await request(app).post("/api/v1/user/login").send({
      email: testData.email,
      password: "invalid-password",
    });
    expect(resp.status).toBe(401);
    expect(resp.body.message).toBe("Incorrect Password");
  });
  it("Should return a 400 status and a message that the email was not provided", async () => {
    const resp = await request(app).post("/api/v1/user/login").send({
      email: "Invalid-Email",
      password: "invalid-password",
    });
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe('"email" must be a valid email');
  });

  it("Should return a 500 status code and a generic error message when an unhandled exception occurs", async () => {
    jest.spyOn(UserService, "login").mockImplementation(() => {
      throw new Error("Unhandled Exception");
    });
    const resp = await request(app).post("/api/v1/user/login").send({
      email: "test@example.com",
      password: "somepassword",
    });
    expect(resp.status).toBe(500);
    expect(resp.body.message).toBe(
      "Server error occurred. Please try again later"
    );
  });
});

describe("POST /api/v1/user/todos", () => {
  it("Should create a todo and return a 200 status code with the created Todo", async () => {
    const randomIndex = Math.floor(Math.random() * fakeTodos.length) as number;
    const randomTitle = fakeTodos[randomIndex].title;
    const randomDesc = fakeTodos[randomIndex].description;
    
    const resp = await request(app)
      .post("/api/v1/user/todos")
      .send({
        title: randomTitle,
        description: randomDesc,
      })
      .set("Authorization", `Bearer ${authToken}`);
      createdTodoId = resp.body.id
    expect(resp.status).toBe(201);
    expect(resp.body).toEqual(
      expect.objectContaining({
        description: expect.any(String),
        title: expect.any(String),
        isCompleted: expect.any(Boolean),
        userId: expect.any(String),
      })
    );
  });
});

describe("GET /api/v1/user/todos", () => {
  it("It should return a JSON file containing the Users Todos", async () => {
    const resp = await request(app)
      .get("/api/v1/user/todos")
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          description: expect.any(String),
          title: expect.any(String),
          isCompleted: expect.any(Boolean),
          userId: expect.any(String),
        }),
      ])
    );
  });

  it("Should return a 200 status code and an object of a todo", async () => {
    const resp = await request(app)
      .get(`/api/v1/user/todos/${createdTodoId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(
      expect.objectContaining({
        id: createdTodoId,
        description: expect.any(String),
        title: expect.any(String),
        isCompleted: expect.any(Boolean),
        userId: expect.any(String),
      })
    );
  });

  it("Should return a 400 error and error message saying the UUID is invalid", async () => {
    const resp = await request(app)
      .get(`/api/v1/user/todos/24242sfs`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe("ID must be a valid UUID");
  });
});
describe("/DELETE /api/v1/user/todos/:id", () => {
  it("Should delete a record and return a 200 status code", async () => {
    console.log("created todo id is " + createdTodoId);
    const resp = await request(app)
    .delete(`/api/v1/user/todos/${createdTodoId}`)
    .set("Authorization", `Bearer ${authToken}`);
    expect(resp.body.message).toBe("Todo deleted successfully!");
    expect(resp.status).toBe(200);
    expect(resp.body.status).toBe(200);
  });

  it("Should return an error message if the id parameter is invalid", async () => {
    const resp = await request(app)
      .delete(`/api/v1/user/todos/invalid_id`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe("Invalid ID!");
    expect(resp.body.status).toBe(400);
  });

  it("Should return an error message if the todo to be deleted does not exist", async () => {
    const nonExistentId = "94d248fa-e220-4565-ba95-8453c26c84f2";
    const resp = await request(app)
      .delete(`/api/v1/user/todos/${nonExistentId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(404);
    expect(resp.body.message).toBe("Todo not found!");
    expect(resp.body.status).toBe(404);
  });
  it("Should return a 400 status code error if the todo ID isnt provided", async () => {

    const resp = await request(app)
      .delete(`/api/v1/user/todos`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(resp.status).toBe(400);
    expect(resp.body.message).toBe('\"todoId\" is required');
    expect(resp.body.status).toBe(400);

  })

  it("Should return a 403 status code if the user Id in the jwt differs from the userId on the todo record", async () => {
    
    const randomIndex = Math.floor(Math.random() * fakeTodos.length) as number;
    const randomTitle = fakeTodos[randomIndex].title;
    const randomDesc = fakeTodos[randomIndex].description;
    
    const userId = fakeUsers[4]?.id || "1b7dce09-5a39-4c45-a946-8c07e49f7d3f";
    const todo = await TodoModel.create({
      title: randomTitle,
      description: randomDesc,
      userId: userId,
      id: "1b7dce09-5a39-4c45-a946-8c07e49f7d3f",
      isCompleted: false
    });

    const resp = await request(app)
    .delete(`/api/v1/user/todos/1b7dce09-5a39-4c45-a946-8c07e49f7d3f}`)
    .set("Authorization", `Bearer ${authToken}`);

    expect(resp.status).toBe(403)
    expect(resp.body.message).toBe("You are not authorized to delete this")
  })

  it("Should return an error message if the user is not authorized to delete the todo", async () => {
    let invalidToken = "fssfs"
    const resp = await request(app)
      .delete(`/api/v1/user/todos/valid_todo_id`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(resp.status).toBe(403);
    expect(resp.body.message).toBe("Unauthorized! You are not allowed to delete this todo.");
    expect(resp.body.status).toBe(403);
  });

  // it("Should return a 500 status code and a generic error message when an unhandled exception occurs", async () => {
  //   jest.spyOn(TodoService, "deleteTodo").mockImplementation(() => {
  //     throw new Error("Unhandled Exception");
  //   });
  //   const resp = await request(app)
  //     .delete("/api/v1/user/todos/valid_todo_id")
  //     .set("Authorization", `Bearer ${authToken}`);
  //   expect(resp.status).toBe(500);
  //   expect(resp.body.message).toBe("Server error occurred. Please try again later");
  // });
});
