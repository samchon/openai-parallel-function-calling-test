import { ILlmApplication } from "@samchon/openapi";
import OpenAI from "openai";
import { IAgenticaController, MicroAgentica } from "@agentica/core";
import { execute } from "./internal/execute";

const task = async (
  api: OpenAI,
  application: ILlmApplication<"chatgpt">,
  value: number
): Promise<number> => {
  let result: number = 0;
  const agentica = new MicroAgentica({
    model: "chatgpt",
    vendor: {
      api,
      model: "gpt-4.1",
    },
    config: {
      executor: {
        describe: null,
      },
      systemPrompt: {
        common: () => "Say English.",
        execute: () =>
          "You are a helpful assistant that doing AI function calling.",
      },
    },
    controllers: [
      {
        protocol: "class",
        name: "default",
        application,
        execute: {
          setValue: (v: { value: number }): void => {
            result = v.value;
          },
        },
      } satisfies IAgenticaController.IClass<"chatgpt">,
    ],
  });
  agentica.on("request", (req) => {
    req.body.tool_choice = "required";
  });
  await agentica.conversate(`Say the number ${value}`);
  return result;
};
execute("Agentica", task).catch(console.error);
