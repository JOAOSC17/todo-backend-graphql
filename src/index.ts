import 'graphql-import-node'
import { getGraphQLParameters, processRequest, renderGraphiQL, Request, sendResult, shouldRenderGraphiQL} from 'graphql-helix'
import Koa from 'koa'
import Router from "@koa/router"
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors';
import { schema } from './schema'
import mongoose from 'mongoose'
import * as dotenv from "dotenv";
dotenv.config();
async function main () {
    const url = process.env.MONGO_URL as string
    const router = new Router()
    const server = new Koa()
    await mongoose.connect(url)
    console.log('Connected to MongoDb')
    router.register('/graphql', ['get', 'post'], async (ctx, next) => {
        const request:Request = {
            headers: ctx.request.headers,
            method: ctx.request.method,
            query: ctx.request.query,
            body:ctx.request.body
        }
        if (shouldRenderGraphiQL(request)) {
            ctx.request.header = {"Content-Type": "text/html"}
            ctx.body = renderGraphiQL({
                endpoint: "/graphql",
              }
            );
    
            return;
          }
        const { operationName, query, variables } = getGraphQLParameters(request)

        const result = await processRequest({
            request,
            schema,
            operationName,
            query,
            variables,
        })
        sendResult(result, ctx.res)
    })
    server.use(cors())
    server.use(bodyParser())
    server.use(router.allowedMethods())
    server.use(router.routes())
    server.listen(3000, () => {
        console.log('Application is running on port 3000')
    })
}
main()