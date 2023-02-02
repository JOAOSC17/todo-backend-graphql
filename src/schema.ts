import { Todo } from "./model/task";
import { makeExecutableSchema } from "@graphql-tools/schema";
import 'babel-plugin-import-graphql'
/// <reference path="../graphql.d.ts" />
import typeDefs from './schema.graphql';
import { compare, hash } from "bcryptjs";
import { User } from "./model/user";
import { sign } from "jsonwebtoken";
import { GraphQLContext } from "context";
const privateKey = process.env.SECRET || 'test'
const resolvers = {
  Query: {
    todos: async (parent: unknown, args: { _id: string, task: string, status: string }, context: GraphQLContext) => {
      try {
        const argsCondition = args._id !== undefined || args.task !== undefined  || args.status !== undefined 
        const todos =  await Todo.find(argsCondition ?{ $or:[{ _id: args._id}, {task: args.task}, {status: args.status }]} : {});
        if(todos.length === 0) {
          throw new Error("No one todo was find");
        }
        return todos
      } catch(ex) {
          console.log(ex);
          throw new Error("Error in search");
      }
  } 
  },
  Mutation: {
    todo: async (parent: unknown, args: { task: string, status: string }, context: GraphQLContext) => {
      try {
          const {_id, task, status} = await Todo.create({
            task:args.task,
            status:args.status
          });
          return {_id, task, status}
      } catch(ex) {
          console.log(ex);
          throw new Error("Error in create todo");
      }
  },
  updateTodo: async (parent: unknown, args: { _id:string, task: string, status: string }, context: GraphQLContext) => {
    try {
      if (!args._id) return;
        return await Todo.findOneAndUpdate(
         {
           _id: args._id
         },
         {
           $set: {
             task: args.task,
             status: args.status,
           }
         }, {new: true})
    } catch(ex) {
        console.log(ex);
        throw new Error("Error in update todo");
    }
},
  deleteTodo: async (parent: unknown, args: { _id:string }, context: GraphQLContext) => {
    try {
      if (!args._id) return;
        return await Todo.findOneAndDelete({_id:args._id});
    } catch(ex) {
        console.log(ex);
        throw new Error("Error in delete todo");
    }
},
    register:async (parent: unknown, args: { name: string, email: string, password: string }, context: GraphQLContext) => {
      try {
        const emailExists = await User.findOne({ email: args.email });
        if (emailExists) throw new Error("Email allready exists");
        const password = await hash(args.password, 10)
        const user = await User.create({
          name:args.name,
          email:args.email,
          password:password
        })
        const token = sign({userId: user._id}, privateKey)
        //context.cookies.set(process.env.COOKIE_NAME as string , token, { domain:"127.0.0.1", path: "/", httpOnly: true }))
        return { token, user }
      } catch (error) {
        console.log(error)
        throw new Error("Error in register your user")
      }
    },
    login:async (parent: unknown, args: { email: string, password: string }, context: GraphQLContext) => {
      try {
        const user = await User.findOne({ email: args.email });
        if (!user) throw new Error("No such user found");
        const valid = await compare(args.password, user.password)
        if(!valid) throw new Error("Invalid password")

        const token = sign({userId: user._id}, privateKey)
        //context.cookies.set(process.env.COOKIE_NAME as string , token, { domain:"127.0.0.1", path: "/", httpOnly: true }))
        return { token, user }
      } catch (error) {
        console.log(error)
        throw new Error("Error in register your user")
      }
    },

  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});