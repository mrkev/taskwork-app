"use server";
import { askGrokGen } from "../../components/ai";
import { nullthrows } from "../../components/utils";

export async function askAI(prompt: string) {
  const response = await askGrok0217(prompt).catch(() =>
    askGrok(prompt).catch(() => askGrok3(prompt))
  );
  return response;
}

export type ModelResponse = {
  modelName: string;
  response: string;
};

async function askGrok(prompt: string): Promise<ModelResponse> {
  const response = await askGrokGen(prompt, "kyi-grok-0202-a");

  const fixed = nullthrows(response, "no response 2");
  return {
    modelName: "kyi-grok-0202-a",
    response: fixed,
  };
}

async function askGrok3(prompt: string): Promise<ModelResponse> {
  const response = await askGrokGen(prompt, "grok-3-latest");
  const fixed = nullthrows(response, "no response 2");
  return {
    modelName: "grok-3-latest",
    response: fixed,
  };
}

async function askGrok0217(prompt: string): Promise<ModelResponse> {
  const response = await askGrokGen(prompt, "research-grok-0217");

  const fixed = nullthrows(response, "no response 2");
  return {
    modelName: "research-grok-0217",
    response: fixed,
  };
}
