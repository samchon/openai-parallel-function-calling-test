import { ILlmApplication } from "@samchon/openapi";
import OpenAI from "openai";
import { IAgenticaController, MicroAgentica } from "@agentica/core";
import { execute } from "./internal/execute";
import { IFunctionCallingResult } from "./internal/IFunctionCallingResult";
import { AutoBePrisma } from "./internal/AutoBePrisma";

const task = async (
  api: OpenAI,
  application: ILlmApplication<"chatgpt">,
  systemPrompt: string,
  analyze: Record<string, string>,
  targetComponent: AutoBePrisma.IComponent,
  otherComponents: AutoBePrisma.IComponent[]
): Promise<IFunctionCallingResult> => {
  let result: IFunctionCallingResult = null!;
  const agentica = new MicroAgentica({
    model: "chatgpt",
    vendor: {
      api,
      model: "gpt-4.1",
    },
    config: {
      executor: {},
      systemPrompt: {
        common: () => systemPrompt,
        execute: () =>
          "You are a helpful assistant that doing AI function calling.",
      },
    },
    histories: [
      {
        type: "assistantMessage",
        text: JSON.stringify({
          requirementAnalysisReport: analyze,
          targetComponent,
          otherComponents,
        }),
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      },
    ],
    controllers: [
      {
        protocol: "class",
        name: "default",
        application,
        execute: {
          make: (v: any): void => {
            result = v;
          },
        },
      } satisfies IAgenticaController.IClass<"chatgpt">,
    ],
  });
  agentica.on("request", (req) => {
    if (req.body.tools) req.body.tool_choice = "required";
  });
  await agentica.conversate(`Do function calling`);
  return result;
};
execute(task).catch(console.error);
