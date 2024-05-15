import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function alreadyLogined(Component: React.ComponentType<any>) {
  return function ProtectedRoute(props: any) {
    const [logined, setLogined] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const handleAuthStateChange = (_: any, session: any) => {
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
      };

      const subscription = supabase.auth.onAuthStateChange(
        handleAuthStateChange
      );

      return () => {
        subscription.data.subscription.unsubscribe();
      };
    });

    return <Component {...props} />;
  };
}
