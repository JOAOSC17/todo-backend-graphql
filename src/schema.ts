import { Context } from "koa";
import { Todo } from "./model/task";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./schema.graphql";

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
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});