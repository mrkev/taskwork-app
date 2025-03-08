"use server";
import { Expert } from "@prisma/client";
import prisma from "../lib/prisma";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  // In a real app, you would validate the email
  // For demo purposes, we'll just redirect to the dashboard
  const email = formData.get("email") as string;

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

  // if (login.status === "ok") {
  //   // Store user info in localStorage for simplicity
  //   localStorage.setItem("login", JSON.stringify(login));
  //
  // }

  redirect("/dashboard");
}
