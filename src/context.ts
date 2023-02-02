import mongoose, { Mongoose } from "mongoose";
import { BaseRequest, Context } from "koa";
import { User } from "model/user";
import { authenticateUser } from "auth";


export type GraphQLContext = {
    mongoose: Mongoose;
    currentUser: typeof User;
};

export async function contextFactory(request: Context) : Promise<GraphQLContext>{
    return {
        mongoose,
        currentUser: await authenticateUser(request) as typeof User
    };
  }