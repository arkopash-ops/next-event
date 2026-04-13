import { useState } from "react";

export function useUserProfile() {
  const [name] = useState(() => {
    if (typeof window === "undefined") return "";

    const user = localStorage.getItem("user");
    if (!user) return "";

    const parsedUser = JSON.parse(user);
    return parsedUser.name ?? "";
  });

  return { name };
}
