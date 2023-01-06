import mongoose, { Mongoose } from "mongoose";
import { BaseRequest } from "koa";


export type GraphQLContext = {
    mongoose: Mongoose;
};

export async function contextFactory() : Promise<GraphQLContext>{
    return {
        mongoose,
    };
  }