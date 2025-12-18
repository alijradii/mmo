import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { fetchUserDataAtom } from "@/state/userAtom";
import { HomePage } from "./home";
import { MainPage } from "./main";

export const RootPage: React.FC = () => {
  const [, fetchUser] = useAtom(fetchUserDataAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(() => 
    !!localStorage.getItem("colyseus-auth-token")
  );

  useEffect(() => {
    const token = localStorage.getItem("colyseus-auth-token");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    
    if (token) {
      fetchUser(); // Fetch user data if token exists
    }
  }, [fetchUser]);

  return isLoggedIn ? <MainPage /> : <HomePage />;
};

