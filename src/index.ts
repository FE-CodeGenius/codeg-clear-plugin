import path from "node:path";
import { performance } from "node:perf_hooks";

import type { CAC } from "cac";
import { ACTIVATION, execCommand, loggerInfo, printInfo } from "code-genius";
import enquirer from "enquirer";
import fs from "fs-extra";

import { clearGlob, ClearOptions, schema, validateArgs } from "./common";

const generateEnquirer = async (
  paths: Array<string>,
): Promise<Array<string>> => {
  const files = fs
    .readdirSync(path.join(process.cwd(), "."))
    .filter((v) => !v.startsWith("."))
    .map((file) => {
      return {
        sort: fs.statSync(path.join(process.cwd(), file)).isFile() ? 1 : 0,
        file,
      };
    });
  files.sort((v1, v2) => v1.sort - v2.sort);

  const fileMultiChoices = files.map((v) => {
    return {
      name: `./${v.file}`,
      message: `${v.file}`,
      hint: paths.includes(`./${v.file}`) ? "建议清理" : "",
    };
  });
  const result = await enquirer.prompt<ClearOptions>([
    {
      name: "files",
      type: "multiselect",
      message: "请选择需要清理的文件/夹",
      choices: fileMultiChoices,
    },
  ]);
  return result.files;
};

const clear = async (paths: string[]) => {
  if (ACTIVATION) {
    loggerInfo(`clear 参数信息: \n ${JSON.stringify(paths)}`);
  }

  validateArgs(schema, paths);

  await execCommand("npx", ["rimraf", "--glob", ...paths], {
    stdio: "inherit",
  });
  printInfo("清理结束");
};

const clearInstaller = (config: ClearOptions) => {
  const { files } = config;
  return {
    name: "clearInstaller",
    setup: (cli: CAC) => {
      cli
        .command("clear", "运行 rimraf 删除不再需要的文件或文件夹")
        .option("-p, --pattern <pattern>", "设置匹配规则")
        .option("-a, --ask", "启用询问模式")
        .action(async (options) => {
          const { pattern, ask } = options;
          let paths = [];
          if (ask) {
            paths = await generateEnquirer(files || clearGlob);
          } else {
            paths = typeof pattern === "string" ? [pattern] : pattern;
          }
          const start = performance.now();
          await clear(paths);
          const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;
          loggerInfo(`😁 clear 命令执行结束, 共用时: ${getTime()}`);
        });
    },
  };
};

export { clear, clearInstaller };
