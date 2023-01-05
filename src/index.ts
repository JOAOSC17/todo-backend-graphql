import 'graphql-import-node'
import { getGraphQLParameters, processRequest, Request, sendResult} from 'graphql-helix'
import Koa from 'koa'
import Router from "@koa/router"
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors';
import { schema } from './schema'
async function main () {
    const router = new Router()
    const server = new Koa()
    
    router.register('/graphql', ['get', 'post'], async (ctx, next) => {
        const request:Request = {
            headers: ctx.request.headers,
            method: ctx.request.method,
            query: ctx.request.query,
            body:ctx.request.body
        }
        const { operationName, query, variables } = getGraphQLParameters(request)

        const result = await processRequest({
            request,
            schema,
            operationName,
            query,
            variables
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