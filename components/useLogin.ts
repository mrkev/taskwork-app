import { Expert } from "@prisma/client";
import { useState } from "react";

export type UserStatus = { status: "ok"; expert: Expert };

export function useLogin(): UserStatus {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("login");
    if (storedUser) {
      return JSON.parse(storedUser) as UserStatus;
    } else {
      throw new Error("not logged in");
    }
  });

  return user;
}
