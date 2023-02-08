import mongoose, { Mongoose } from "mongoose";
import { BaseRequest } from "koa";
import { User } from "./model/user";
import { authenticateUser } from "./auth";


export type GraphQLContext = {
    mongoose: Mongoose;
    currentUser: typeof User | null;
};

export async function contextFactory(request: BaseRequest) : Promise<GraphQLContext>{
    return {
        mongoose,
        currentUser: await authenticateUser(request)
    };
  }