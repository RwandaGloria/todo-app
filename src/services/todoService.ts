import { TodoModel } from "../models/TodoModel";
import { CustomError } from "../types/types";
import { UpdateTodoData } from "../types/types";
import { Todo } from "../types/types";

export class TodoService {
 static async getAllTodos(userId: string): Promise<TodoModel[]> {
      const todos = await TodoModel.findAll({ where: { userId } });
      if (!todos) {
        throw new CustomError("No todos found", 404)
      }
      return todos;
  
  }

  static async getTodo(id: string, userId: string) : Promise<TodoModel | null>
  {

    try {
      const todo = await TodoModel.findOne({where: {id: id, userId: userId}});
      if (!todo) {
        throw new CustomError( "No todo found", 404)
      }
  
      
      return todo;
    }
    catch(err) {
      throw err
    }
  }
  static async createTodo(body: Todo): Promise<TodoModel> {
    const newTodo = await TodoModel.create(body);
    if(!newTodo) {
      throw new CustomError( "Todo was not created. Please try again later.", 500)
    }
    return newTodo;
  }

  static async deleteTodo(id: string, userId: string): Promise<void> {
    const todo = await TodoModel.findByPk(id);
    if (!todo) {
      throw new CustomError('Todo not found', 404);
    }
    if (todo.userId !== userId) {
      throw new CustomError('Unauthorized: You are not allowed to delete this todo', 403);
    }
    await todo.destroy();
  }
  static async updateTodo(todoId: string, userId: string, data: UpdateTodoData) {
    const todo = await TodoModel.findOne({ where: { id: todoId, userId } });
    if (!todo) {
      throw new CustomError('Todo not found', 404);
    }
    await todo.update(data);
    return todo;
  }
}
