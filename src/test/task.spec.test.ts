import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { schema } from '../schema'
import {
  Todo,
} from '../model/task';
import { clearDatabase, connect, disconnectDatabase } from './mongooseConnection';
describe('CRUD Tasks', () => {
  beforeAll(() => connect())
  afterAll(() => {
    disconnectDatabase()
    // clearDatabase()
  });
  it('should be create new task',  async () => {
    const todo = {
      task: 'conectar a api',
      status:'in progress'
    }
    const source = `
    mutation{
      todo (task:"${todo.task}", status: "${todo.status}"){
        task,
        status
      }
    }
    `;
    const result = await graphql({ schema, source })
    expect(result.data?.todo).toMatchObject(todo)
  })
  it('should be show all tasks', async () => {
    const source = `
    query{
      todos{
        _id,
        task,
        status,
      }
    }
    `;
  
    const result = await graphql({ schema, source })
    const todos = await Todo.find()
    const testArray = todos.map(todo => {return {_id:todo._id, task:todo.task, status: todo.status}})
    expect(result.data?.todos).toMatchObject(testArray)
  })
  it('should be show single task', async () => {
    const todos = await Todo.find()
    const randomNumber = Math.floor(Math.random() * (todos.length - 1))
    const todoExample = todos[randomNumber]
    const source = `
    query{
      todos(_id:"${todoExample._id}", task:"${todoExample.task}", status:"${todoExample.status}"){
        _id,
        task,
        status,
      }
    }
    `;
  
    const result = await graphql({ schema, source })
    const testArray = await Todo.find({ $or:[{ _id: todoExample._id}, {task: todoExample.task}, {status: todoExample.status }]})
    const testSearch = testArray.map(todo => {return {_id:todo._id, task:todo.task, status: todo.status}})
    expect(result.data?.todos).toMatchObject(testSearch)
  })
})