import { Context } from "koa";
import { Todo } from "./model/task";
import { makeExecutableSchema } from "@graphql-tools/schema";
import 'babel-plugin-import-graphql'
/// <reference path="../graphql.d.ts" />
import typeDefs from './schema.graphql';

const resolvers = {
  Query: {
    todos: async (parent: unknown, args: {}, context: Context) => {
      try {
          return await Todo.find();
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
  } 
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});