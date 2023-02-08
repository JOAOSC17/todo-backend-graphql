import { BaseRequest, Context } from 'koa'
import { JwtPayload, verify } from 'jsonwebtoken'
import { User } from './model/user';

export async function authenticateUser(request: BaseRequest): Promise<typeof User | null>{
  const secret = process.env.JWT_SECRET as string
  if (request?.headers?.authorization) {
    try {
      const token = request.headers.authorization.split(" ")[1];
      if (!token) {
        throw new Error('Authentication failed!');
      }
      const tokenPayload = verify(token, secret) as JwtPayload;
      const userId = tokenPayload.userId;
      return await User.findById(userId);      
    } catch (error) {
      console.log(error)
    }
    }
    return null;
}









// verifycokie
// export const verify = (ctx: Context) => {
//     const cookie = ctx.cookies.get(process.env.COOKIE_NAME as string);
//     if (cookie) {
//       try {
//         const result = jwt.verify(cookie, process.env.JWT_JWT_SECRET as string) as { userId: string };
//         ctx.response.status = 200;
//         ctx.response.body = JSON.stringify({ user: result.userId });
//       } catch (ex) {
//         ctx.response.status = 401;
//         ctx.response.body = JSON.stringify({ msg: "Invalid token" });
//       }
//     } else {
//       ctx.response.status = 403;
//       ctx.response.body = JSON.stringify({ msg: "You are not authorized for this resource" });
//     }
//   }