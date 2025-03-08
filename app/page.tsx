"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { doLogin } from "./doLogin";

export default function LoginPage() {
  const router = useRouter();
  async function handleLogin(formData: FormData) {
    // In a real app, you would validate the email
    // For demo purposes, we'll just redirect to the dashboard
    const email = formData.get("email") as string;

    const login = await doLogin({ email });
    console.log(login);

    if (login.status === "ok") {
      // Store user info in localStorage for simplicity
      localStorage.setItem("login", JSON.stringify(login));
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Problem Management App
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
