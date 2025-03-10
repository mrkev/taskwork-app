"use server";
import { askGrok0217, askGrok3, askGrokKYI } from "../../components/ai";
import prisma from "../../lib/prisma";
// import type { Prisma } from "@prisma/client";

export async function askAI(prompt: string) {
  const response = await askGrok0217(prompt).catch(() =>
    askGrokKYI(prompt).catch(() => askGrok3(prompt))
  );
  return response;
}

export type TaskData = {
  authorId: number;
  prompt: string;
  veredict: string;
  critique?: string;
  correctSolution?: string;
  promptImprovement?: string;
  modelName: string;
  modelResponse: string;
};

export async function submitTask(data: TaskData) {
  console.log("Submitting task data:", data);

  const result = await prisma.task.create({
    data: {
      authorId: data.authorId, // todo: validate author

      prompt: data.prompt,
      veredict: data.veredict,
      critique: data.critique,
      correctSolution: data.correctSolution,
      promptImprovement: data.promptImprovement,

      // model
      modelName: data.modelName, // todo
      modelResponse: data.modelResponse,
    },
  });

  console.log("submitted", data);

  // For now, we'll just return a success message
  return { success: true, message: "Challenge submitted successfully" };
}
