import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PLAYLOAD_NAME } from "../common/authconstants";


export const TokenPlayloadParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp()
    const request: Request = context.getRequest();

    return request[REQUEST_TOKEN_PLAYLOAD_NAME]
  }
)