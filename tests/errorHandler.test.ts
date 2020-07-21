import {
  assertThrowsAsync,
  createHttpError,
  Status,
  RouterContext,
} from "../deps.ts";
import { errorHandlerMiddleware } from "../mod.ts";

const mockContext = (): RouterContext => ({}) as RouterContext;

const mockNext = () => {
  return new Promise<void>(() => {
    throw new Error("test");
  });
};

const mockNextHttp = () => {
  return new Promise<void>(() => {
    throw createHttpError(Status.BadRequest, "test");
  });
};

const tests = [
  {
    name: "Throws in fallback",
    async fn() {
      const mw = errorHandlerMiddleware({
        fallback: (err, ctx) => {
          throw new Error(err as string);
        },
      });

      assertThrowsAsync(
        async () => await mw(mockContext(), mockNext),
        Error,
        "test",
      );
    },
  },
  {
    name: "Throws in with Status",
    async fn() {
      const mw = errorHandlerMiddleware({
        fallback: (err, ctx) => {
          throw new Error(err as string);
        },
        cases: {
          [Status.BadRequest]: (err, ctx) => {
            throw new Error(err as string);
          },
        },
      });

      assertThrowsAsync(
        async () => await mw(mockContext(), mockNextHttp),
        Error,
        "test",
      );
    },
  },
];

for await (const test of tests) {
  Deno.test(test);
}
