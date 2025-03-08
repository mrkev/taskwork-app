"use server";
import prisma from "../../lib/prisma";

export async function getTasks({ authorId }: { authorId: number }) {
  // In a real app, you would validate the email
  const tasks = await prisma.task.findMany({
    where: {
      authorId,
    },
  });

  return tasks;
}
