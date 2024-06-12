import { TodoService } from "../services/todoService";
import { TodoModel } from "../models/TodoModel";
import { CustomError } from "../types/types";
import { Todo } from "../types/types";
import { fakeTodos } from "./fakes/todos";


describe('getAllTodos', () => {
    it('should return an array of todos for a valid user ID', async () => {
      const userId = 'validUserId';
      const todo1 = new TodoModel(fakeTodos[1])
      const todo2 = new TodoModel(fakeTodos[2])
      
      const expectedTodos = [todo1, todo2];
      jest.spyOn(TodoModel, 'findAll').mockResolvedValue(expectedTodos);
  
      const todos = await TodoService.getAllTodos(userId);
  
      expect(todos).toEqual(expectedTodos);
    });
  
    it('should return an empty array when no todos are found', async () => {
      const userId = 'invalidUserId';
      jest.spyOn(TodoModel, 'findAll').mockResolvedValue([]);
      const todos = await TodoService.getAllTodos(userId);
      expect(todos).toEqual([]); 
    });
  })
describe('getTodo', () => {
  it('should return a todo for a valid todo ID and user ID', async () => {
    const todoId = 'validTodoId';
    const userId = 'validUserId';
    const expectedTodo = new TodoModel(fakeTodos[4])
    jest.spyOn(TodoModel, 'findOne').mockResolvedValue(expectedTodo);

    const todo = await TodoService.getTodo(todoId, userId);

    expect(todo).toEqual(expectedTodo);
  });

  it('should throw a CustomError with status code 404 when no todo is found', async () => {
    const todoId = 'invalidTodoId';
    const userId = 'validUserId';
    jest.spyOn(TodoModel, 'findOne').mockResolvedValue(null);

    await expect(TodoService.getTodo(todoId, userId)).rejects.toThrow(new CustomError('No todo found', 404));
  });
});

describe('createTodo', () => {
  it('should create a new todo', async () => {
    const createMock = jest.spyOn(TodoModel, 'create').mockResolvedValue({
      title: 'New Todo Title',
      userId: 'userId',
      description: 'New Todo Description',
      isCompleted: false,
    } as TodoModel);

    const newTodoData: Todo = {
      title: 'New Todo Title',
      userId: 'userId',
      description: 'New Todo Description',
      isCompleted: false,
        };

    const createdTodo = await TodoService.createTodo(newTodoData);

    expect(createMock).toHaveBeenCalledWith(newTodoData);
    expect(createdTodo).toEqual(expect.objectContaining(newTodoData));
  });

  it('should throw a CustomError if TodoModel.create fails', async () => {
    jest.spyOn(TodoModel, 'create').mockResolvedValue(null);

    const newTodoData: Todo = {
      title: 'New Todo Title',
      userId: 'userId',
      description: 'New Todo Description',
      isCompleted: false,
    };

    await expect(TodoService.createTodo(newTodoData)).rejects.toThrow(new CustomError('Todo was not created. Please try again later.', 500));
  });
});

describe('deleteTodo', () => {
  it('should delete the todo with the provided ID and user ID', async () => {
    const todoId = 'todo-Id';
    const userId = 'user-Id';
    const todo = new TodoModel(fakeTodos[3]);
    jest.spyOn(TodoModel, 'findByPk').mockResolvedValue(todo);
    const deletedObj = jest.spyOn(todo, 'destroy');

    await TodoService.deleteTodo(todo.id, todo.userId);
    expect(deletedObj).toHaveBeenCalled();
  });
  it('should not delete the todo and give an throw a Custom error', async () => {
    const todoId = 'todo-Id';
    const userId = 'user-Id';
    const todo = new TodoModel(fakeTodos[3]);
    jest.spyOn(TodoModel, 'findByPk').mockResolvedValue(todo);
    const deletedObj = jest.spyOn(todo, 'destroy');
    await TodoService.deleteTodo(todo.id, todo.userId);

    await expect(TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new CustomError('Unauthorized: You are not allowed to delete this todo', 403));
  });

  it('should throw a CustomError with status code 404 when no todo is found', async () => {
    const todoId = 'todo-id';
    const userId = 'user-id';
    jest.spyOn(TodoModel, 'findByPk').mockResolvedValue(null);

    await expect(TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new CustomError('Todo not found', 404));
  });

  it('should throw a CustomError with status code 403 when the user is unauthorized', async () => {
    const todoId = 'validTodoId';
    const userId = 'unauthorizedUserId';
    const todo = new TodoModel(fakeTodos[0])
    jest.spyOn(TodoModel, 'findByPk').mockResolvedValue(todo);

    await expect(TodoService.deleteTodo(todoId, userId)).rejects.toThrow(new CustomError('Unauthorized: You are not allowed to delete this todo', 403));
  });
});

describe('updateTodo', () => {
  it('should update the todo with the provided data', async () => {
    const todoId = 'validTodoId';
    const userId = 'validUserId';
    const updateData = { title: 'Updated Title' };
    const todo = fakeTodos[0];

    jest.spyOn(TodoModel, "findOne").mockResolvedValue({
      id: todo.id,
      title: todo.title,
      userId: todo.userId,
      description: '',
      isCompleted: false,
      isNewRecord: false,
      sequelize: {}, 
      where: {}, 
      getDataValue: jest.fn(), 
      _attributes: {}, 
      _creationAttributes: {},
      update: jest.fn().mockResolvedValue(undefined),
      dataValues: {},
      _modelOptions: {},
      _options: {},
    } as any);

    const todoInstance = await TodoModel.findOne();
    await TodoService.updateTodo(todoId, userId, updateData);
    expect(todoInstance?.update).toHaveBeenCalledWith(updateData);
  });

  it('should throw a CustomError with status code 404 when no todo is found', async () => {
    const todoId = 'invalidTodoId';
    const userId = 'validUserId';
    jest.spyOn(TodoModel, 'findOne').mockResolvedValue(null);

    await expect(TodoService.updateTodo(todoId, userId, {})).rejects.toThrow(new CustomError('Todo not found', 404));
  });
});

  
