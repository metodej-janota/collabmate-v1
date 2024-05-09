import { useRouter } from "next/router";
import { useState } from "react";
import { supabase } from "./supabase";

export default function alreadyLogined(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const [logined, setLogined] = useState(false);
    const router = useRouter();

    supabase.auth.onAuthStateChange((_, session) => {
      if (session == undefined) {
        setLogined(false);
        if (logined == false) {
          router.replace("/login");
        } else {
          return;
        }
      } else {
        return;
      }
    });
    return <Component {...props} />;
  };
}
