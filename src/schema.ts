import { Context } from "koa";
import { Todo } from "./model/task";
import { makeExecutableSchema } from "@graphql-tools/schema";
import 'babel-plugin-import-graphql'
/// <reference path="../graphql.d.ts" />
import typeDefs from './schema.graphql';

const resolvers = {
  Query: {
    todos: async (parent: unknown, args: { _id: string, task: string, status: string }, context: Context) => {
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
    todo: async (parent: unknown, args: { task: string, status: string }, context: Context) => {
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
  updateTodo: async (parent: unknown, args: { _id:string, task: string, status: string }, context: Context) => {
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
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});