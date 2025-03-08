"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { doLogin } from "./doLogin";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // In a real app, you would validate the email
    // For demo purposes, we'll just redirect to the dashboard
    const email = formData.get("email") as string;
    setLoading(true);

    const login = await doLogin({ email });

    if (login.status === "ok") {
      // Store user info in localStorage for simplicity
      localStorage && localStorage.setItem("login", JSON.stringify(login));
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-serif text-center">
            Sign In
          </CardTitle>
          {/* <CardDescription className="text-center">
            Enter your institutional email to continue
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span
                  className="loader"
                  style={{
                    width: 24,
                    height: 24,
                    borderColor: "white",
                    borderBottomColor: "transparent",
                  }}
                ></span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
