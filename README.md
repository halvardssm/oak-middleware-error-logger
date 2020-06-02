# Oak Middleware Error & Logging

![CI](https://github.com/halvardssm/oak-middleware-error-logger/workflows/CI/badge.svg)
[![(Deno)](https://img.shields.io/badge/deno-1.0.2-green.svg)](https://deno.land)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/raw.githubusercontent.com/halvardssm/oak-middleware-error-logger/master/mod.ts)

Oak middleware for error handling and logging

## Usage

* As an application middleware

  ```ts
  import { errorHandlerMiddleware } from "https://raw.githubusercontent.com/halvardssm/oak-middleware-error-logger/master/mod.ts"
  import { Middleware } from "https://deno.land/x/oak/mod.ts";

  
  const app = new Application();
  
  app.use(errorHandlerMiddleware<Middleware>({
    fallback: (err, ctx) => {
      throw new Error(err as string);
    },
  }));
  
  await app.listen(appOptions);
  ```

* As a router middleware

  ```ts
  import { errorHandlerMiddleware, logger } from "https://raw.githubusercontent.com/halvardssm/oak-middleware-error-logger/master/mod.ts"
  import { RouterMiddleware } from "https://deno.land/x/oak/mod.ts";

  
  const app = new Application();
  
  app.use(errorHandlerMiddleware<RouterMiddleware>({
    fallback: (err, ctx) => {
      throw new Error(err as string);
    },
    cases: {
      404: (err, ctx) => someMehod(),
      [ErrorStatus.BadRequest]: (err, ctx) => logger({ logInfo: err })
    }
  }));
  
  await app.listen(appOptions);
  ```

## Options

ErrorHandler Options

* fallback: errorCallback; // Fallback function for handling all errors which are not handled by the cases
* cases?: Record<number | string, errorCallback>; // Record of all cases with a callback to handle errors

Logger Options

* logInfo: string | object; // Log text or object
* fileName?: string; // Custom filename, will default to `.log/mm-yyyy.txt` e.g `.log/04-2020.txt`
* prepend?: string; // Custom prepend for log line, will default to iso date e.g. `2020-05-25T17:38:42.483Z: `
* append?: string // Custom append for log line, will default to `\n`
* noEscapeNewLine?: boolean; // Default escapes newline in logInfo, enable this to turn it off
* customFormatting?: (log: string) => string; // Add custom formatting to logInfo

## Contributing

All contributions are welcome, make sure to read the [contributing guidelines](./.github/CONTRIBUTING.md).

## Uses

* [Oak](https://deno.land/x/oak/)
