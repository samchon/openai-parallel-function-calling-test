import { ILlmApplication } from "@samchon/openapi";
import "dotenv/config";
import OpenAI from "openai";
import typia from "typia";

export async function execute(
  title: string,
  task: (
    api: OpenAI,
    func: ILlmApplication<"chatgpt">,
    value: number
  ) => Promise<number>
) {
  const api = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const values: number[] = new Array(200).fill(0).map((_, i) => i);
  const results: number[] = await Promise.all(
    values.map((v) => task(api, application, v))
  );
  const equal: boolean =
    values.length === results.length &&
    values.every((v, i) => v === results[i]);
  console.log(title, equal ? "success" : JSON.stringify(results, null, 2));
}

interface IApplication {
  /**
   * Set numeric value.
   *
   * @param p.value The value to set
   */
  setValue(p: { value: number }): void;
}
const application: ILlmApplication<"chatgpt"> = typia.llm.application<
  IApplication,
  "chatgpt"
>();
