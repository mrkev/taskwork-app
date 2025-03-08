"use server";
import { redirect } from "next/navigation";
import prisma from "../lib/prisma";

export async function doLogin({ email }: { email: string }) {
  // In a real app, you would validate the email
  const expert = await prisma.expert.upsert({
    create: {
      email: email,
      firstName: "Test",
      lastName: "Test",
      institution: "Test",
    },
    update: {
      email: email,
      firstName: "Test",
      lastName: "Test",
      institution: "Test",
    },
    where: {
      email: email,
    },
  });

  console.log({ status: "ok", expert });

  return { status: "ok", expert };

  // redirect("/dashboard");
}
