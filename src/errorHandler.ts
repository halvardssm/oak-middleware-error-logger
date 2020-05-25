import { Context, HttpError, Middleware, RouterMiddleware } from "../deps.ts";

export type errorCallback = (
  err: HttpError | string | number,
  ctx: Context,
) => void;

export type errorHandlerMiddlewareOptions = {
  fallback: errorCallback; // Fallback function for handling all errors which are not handled by the cases
  cases?: Record<number | string, errorCallback>; // Record of all cases with a callback to handle errors
};

export const errorHandlerMiddleware = <
  T extends RouterMiddleware | Middleware = Middleware,
>(options: errorHandlerMiddlewareOptions): T => {
  const { cases, fallback } = options;

  const core: Middleware = async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (cases?.[err.status]) {
        cases[err.status](err, ctx);
      } else {
        fallback(err, ctx);
      }
    }
  };

  return core as T;
};

export default { errorHandlerMiddleware };
