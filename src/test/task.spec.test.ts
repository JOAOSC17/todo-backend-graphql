import mongoose from 'mongoose'
import { graphql } from 'graphql'
import { schema } from '../schema'
import gql from 'graphql-tag'
import * as http from 'http'
import { Todo } from '../model/task'
import koa from 'koa'
import { User } from '../model/user'
import { faker } from '@faker-js/faker'
import { GraphQLContext } from 'context'
import {
    clearDatabase,
    connect,
    disconnectDatabase,
} from './mongooseConnection'
import supertest from 'supertest'
import app  from './../index'
interface AuthPayload {
    token: string
    user: typeof User
}
async function authUserTest() {
    const userTest = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
    const source = `
  mutation{
    register(name:"${userTest.name}", email:"${userTest.email}", password:"${userTest.password}"){
      token
      user{
      name
      email
      }
      }
    }`
    const result = await graphql({ schema, source })
    const data = result.data?.register as AuthPayload
    return data.token
}
describe('CRUD Tasks', () => {
    beforeAll(async () => {
        await connect()
        const mockListen = jest.fn()
        app.listen = mockListen
    })
    afterAll(() => {
        disconnectDatabase()
        app.close()
        // clearDatabase()
    })
    it('should be create new task', async () => {
        const todo = {
            task: faker.lorem.words(),
            status: faker.helpers.arrayElement([
                'pending',
                'complete',
                'in progress',
            ]),
        }
        const query = gql`
            mutation{
            todo (task:"${todo.task}", status: "${todo.status}"){
                task,
                status
            }
            }
        `
        const { body } = await supertest(app)
            .post('/graphql')
            .send({ query })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${await authUserTest()}`)
        expect(body).not.toBeNull()
        expect(body).not.toBeUndefined()
        expect(body.data.todo).not.toBeNull()
        expect(body.data.todo).not.toBeUndefined()
        expect(body.data.todo).toMatchObject(todo)
    })
    it('should be show all tasks', async () => {
        const query = `
            query{
            todos{
                _id,
                task,
                status,
            }
            }
    `
        const { body } = await supertest(app)
            .post('/graphql')
            .send({ query })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${await authUserTest()}`)
        expect(body.data.todos).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    task: expect.any(String),
                    status: expect.any(String),
                }),
            ])
        )
    })
    it('should be show single task', async () => {
        const todos = await Todo.find()
        const randomNumber = Math.floor(Math.random() * (todos.length - 1))
        const todoExample = todos[randomNumber]
        const query = `
        query{
        todos(_id:"${todoExample._id}", task:"${todoExample.task}", status:"${todoExample.status}"){
            _id,
            task,
            status,
        }
        }
    `

        const { body } = await supertest(app)
            .post('/graphql')
            .send({ query })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${await authUserTest()}`)

        expect(body).not.toBeNull()
        expect(body).not.toBeUndefined()
        expect(body.data.todos).not.toBeUndefined()
        expect(body.data.todos).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    _id: expect.any(String),
                    task: expect.any(String),
                    status: expect.any(String),
                }),
            ])
        )
    })
    it('should be update task', async () => {
        const todos = await Todo.find()
        const randomNumber = Math.floor(Math.random() * (todos.length - 1))
        const todoExample = {
            _id: todos[randomNumber]._id,
            task: faker.lorem.words(),
            status: faker.helpers.arrayElement([
                'pending',
                'complete',
                'in progress',
            ]),
        }
        const query = `
    mutation{
      updateTodo(_id:"${todoExample._id}", task:"${todoExample.task}", status:"${todoExample.status}"){
        _id,
        task,
        status,
      }
    }
    `

        const { body } = await supertest(app)
            .post('/graphql')
            .send({ query })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${await authUserTest()}`)
        expect(body.data.updateTodo).toHaveProperty('_id')
        expect(body.data.updateTodo).toHaveProperty('task')
        expect(body.data.updateTodo).toHaveProperty('status')
        expect(body.data.updateTodo).toMatchObject(todoExample)
    })
    it('should be delete task', async () => {
        const todos = await Todo.find()
        const randomNumber = Math.floor(Math.random() * (todos.length - 1))
        const todoExample = {
            _id: todos[randomNumber]._id,
            task: todos[randomNumber].task,
            status: todos[randomNumber].status,
        }
        const query = `
    mutation{
      deleteTodo(_id:"${todoExample._id}"){
        _id,
        task,
        status,
      }
    }
    `
        const { body } = await supertest(app)
            .post('/graphql')
            .send({ query })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${await authUserTest()}`)
        expect(body.data.deleteTodo).toHaveProperty('_id')
        expect(body.data.deleteTodo).toHaveProperty('task')
        expect(body.data.deleteTodo).toHaveProperty('status')
        expect(body.data.deleteTodo).toMatchObject(todoExample)
    })
})
