"use server";
import OpenAI from "openai";
import { nullthrows } from "./utils";

const SYSTEM_PROMPT = `
You are "The AI", a chatbot designed to answer hard technical questions.

You answer confidently and in assertive manner. When you're not asked a question, 
you simply reply: "I'm ready to tackle any question you throw my way."
`;

export async function askGrokGen(
  prompt: string,
  model: "kyi-grok-0202-a" | "grok-3-latest" | "research-grok-0217"
): Promise<string | null> {
  console.log(process.env);
  const client = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/research/grokx",
  });

  const completion = await client.chat.completions.create({
    model,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const response = (completion.choices[0] as any).content.response;
  console.log(`${model}:`, response);
  return response;
}

export type ModelResponse = {
  modelName: string;
  response: string;
};

export async function askGrokKYI(prompt: string): Promise<ModelResponse> {
  const answer = await askGrokGen(prompt, "kyi-grok-0202-a");

  return {
    modelName: "kyi-grok-0202-a",
    response: nullthrows(answer, "no response"),
  };
}

export async function askGrok3(prompt: string): Promise<ModelResponse> {
  const answer = await askGrokGen(prompt, "grok-3-latest");

  return {
    modelName: "grok-3-latest",
    response: nullthrows(answer, "no response"),
  };
}

export async function askGrok0217(prompt: string): Promise<ModelResponse> {
  const answer = await askGrokGen(prompt, "research-grok-0217");

  return {
    modelName: "research-grok-0217",
    response: nullthrows(answer, "no response"),
  };
}
