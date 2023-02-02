import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { schema } from '../schema'
import {
  User,
} from '../model/user';
import { clearDatabase, connect, disconnectDatabase } from './mongooseConnection';
interface User {
    _id:string;
    name:string;
    email:string;
    password:string;
}
interface AuthPayload {
    token:string
    user: User
}
describe('CRUD User', () => {
    beforeAll(() => connect())
    afterAll(() => {
      disconnectDatabase()
      // clearDatabase()
    });
    it('should be register new user and login', async () => {
        const user = {
            name:'Jhon Doe',
            email:'jhondoe@email.com',
            password:'123'
        }
        const source = `
            mutation{
                register(name:"${user.name}", email:"${user.email}", password:"${user.password}"){
                token
                user{
                name
                email
                }
            }
        }
        `
    const { data } = await graphql({ schema, source })
    const authPayload = data?.register as unknown as AuthPayload
    expect(authPayload).not.toBeNull()
    expect(authPayload).not.toBeUndefined()
    expect(authPayload).toHaveProperty('token')
    expect(authPayload).toHaveProperty('user')
    expect(authPayload?.user).toHaveProperty('email')
    expect(authPayload?.user).toHaveProperty('name')
    })
    it('should be login', async () => {
        const user = {
            name:'Jhon Doe',
            email:'jhondoe@email.com',
            password:'123'
        }
        const source = `
            mutation{
                login(email:"${user.email}", password:"${user.password}"){
                token
                user{
                name
                email
                }
            }
        }
        `
    const { data } = await graphql({ schema, source })
    const authPayload = data?.login as unknown as AuthPayload
    expect(authPayload).not.toBeNull()
    expect(authPayload).not.toBeUndefined()
    expect(authPayload).toHaveProperty('token')
    expect(authPayload).toHaveProperty('user')
    expect(authPayload?.user.email).toBe(user.email)
    expect(authPayload?.user.name).toBe(user.name)
    expect(authPayload?.user).toHaveProperty('name')
    expect(authPayload?.user).toHaveProperty('email')
    expect(authPayload?.user).toHaveProperty('name')
    })
    it.todo('should be show all users')
    it.todo('should be show single user')
    it.todo('should be update user')
    it.todo('should be delete user')
})