import { ILlmApplication } from "@samchon/openapi";

import OpenAI from "openai";
import { execute } from "./internal/execute";
import { AutoBePrisma } from "./internal/AutoBePrisma";
import { IFunctionCallingResult } from "./internal/IFunctionCallingResult";

const task = async (
  api: OpenAI,
  application: ILlmApplication<"chatgpt">,
  systemPrompt: string,
  analyze: Record<string, string>,
  targetComponent: AutoBePrisma.IComponent,
  otherComponents: AutoBePrisma.IComponent[]
): Promise<IFunctionCallingResult> => {
  const response = await api.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "assistant",
        content: JSON.stringify({
          requirementAnalysisReport: analyze,
          targetComponent,
          otherComponents,
        }),
      },
      {
        role: "user",
        content: "Do function calling",
      },
      {
        role: "system",
        content: "You are a helpful assistant that doing AI function calling.",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: application.functions[0].name,
          description: application.functions[0].description,
          parameters: application.functions[0].parameters as any,
        },
      },
    ],
    tool_choice: "required",
  });
  const obj = JSON.parse(
    response.choices[0].message.tool_calls![0].function.arguments
  );
  return obj;
};
execute(task).catch(console.error);
