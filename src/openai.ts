import { ILlmApplication } from "@samchon/openapi";

import OpenAI from "openai";
import { execute } from "./internal/execute";

const task = async (
  api: OpenAI,
  application: ILlmApplication<"chatgpt">,
  value: number
): Promise<number> => {
  const response = await api.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: "Say English.",
      },
      {
        role: "user",
        content: `Say the number ${value}`,
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
  return obj.value as number;
};
execute("OpenAI API", task).catch(console.error);
