import { assertStringContains } from "../deps.ts";
import { logger } from "../mod.ts";
const tests = [
  {
    name: "Test string",
    async fn() {
      const date = new Date();
      const fileName =
        `.log/error-${date.getMonth()}-${date.getFullYear()}.txt`;

      await logger({ logInfo: "test", fileName });

      const content = await Deno.readTextFile(fileName);
      const contentArr = content.split("\n");

      assertStringContains(contentArr[contentArr.length - 2], "test");
    },
  },
  {
    name: "Test object",
    async fn() {
      const date = new Date();
      const fileName =
        `.log/error-${date.getMonth()}-${date.getFullYear()}.txt`;

      await logger({ logInfo: { test: "test" }, fileName });

      const content = await Deno.readTextFile(fileName);
      const contentArr = content.split("\n");

      assertStringContains(contentArr[contentArr.length - 2], "test");
    },
  },
  {
    name: "Test custom formatting",
    async fn() {
      const date = new Date();
      const fileName =
        `.log/error-${date.getMonth()}-${date.getFullYear()}.txt`;

      await logger(
        {
          logInfo: "test",
          fileName,
          customFormatting: (log) => log.replace(/test/g, "foo"),
        },
      );

      const content = await Deno.readTextFile(fileName);
      const contentArr = content.split("\n");

      assertStringContains(contentArr[contentArr.length - 2], "foo");
    },
  },
];

for await (const test of tests) {
  Deno.test(test);
}
