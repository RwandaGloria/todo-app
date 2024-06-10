import { TodoModel } from "../models/TodoModel";

export class TodoService {
 static async getAllTodos(userId: string): Promise<TodoModel[]> {
    try {
      const todos = await TodoModel.findAll({ where: { userId } });
      if (todos.length === 0) {
        throw { message: "No todos found", statusCode: 200 }; 
      }
      return todos;
    } catch (err) {
      throw { message: "Error fetching todos", statusCode: 500 }; 
    }
  }
}
