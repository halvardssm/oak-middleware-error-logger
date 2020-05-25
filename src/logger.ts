import { dirname } from "../deps.ts";

export type loggerOptions = {
  logInfo: string | object; // Log text or object
  fileName?: string; // Custom filename, will default to `.log/mm-yyyy.txt` e.g `.log/04-2020.txt`
  prepend?: string; // Custom prepend for log line, will default to iso date e.g. `2020-05-25T17:38:42.483Z: `
  append?: string; // Custom append for log line, will default to `\n`
  noEscapeNewLine?: boolean; // Default escapes newline in logInfo, enable this to turn it off
  customFormatting?: (log: string) => string; // Add custom formatting to logInfo
};

export type mkdirArgsT = [
  string,
  Deno.MkdirOptions | undefined,
];
export type writeFileArgsT = [
  string,
  Uint8Array,
  Deno.WriteFileOptions | undefined,
];
export type loggerReturnT = [
  mkdirArgsT,
  writeFileArgsT,
];

const loggerCore = (options: loggerOptions) => {
  const date = new Date();
  const encoder = new TextEncoder();
  const logData = typeof options.logInfo === "string"
    ? options.logInfo
    : JSON.stringify(options.logInfo);
  const append = options.append ?? "\n";
  const prepend = options.prepend ?? (date.toISOString() + ": ");
  let log = options.noEscapeNewLine ? logData : logData.replace(/\n/g, "\\n");

  if (options.customFormatting) {
    log = options.customFormatting(log);
  }

  const data = encoder.encode(prepend + log + append);
  const name = options.fileName ??
    `.log/${date.getMonth()}-${date.getFullYear()}.txt`;
  const writeFileOptions: Deno.WriteFileOptions = { append: true };
  const mkdirOptions: Deno.MkdirOptions = { recursive: true };

  return [[dirname(name), mkdirOptions], [name, data, writeFileOptions]];
};

export const logger = async (options: loggerOptions): Promise<void> => {
  const args = loggerCore(options) as loggerReturnT;

  await Deno.mkdir(...args[0]);
  await Deno.writeFile(...args[1]);
};

export const loggerSync = (options: loggerOptions): void => {
  const args = loggerCore(options) as loggerReturnT;

  Deno.mkdirSync(...args[0]);
  Deno.writeFileSync(...args[1]);
};

export default { loggerSync, logger };
