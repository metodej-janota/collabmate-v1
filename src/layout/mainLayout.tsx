import { Toaster } from "@/components/ui/toaster";
import {
  insertUserToDatabase,
  userExistsInDatabase,
} from "../supabase/lib/databaseLogic";
import { supabase } from "../supabase/supabase";
import { Navbar } from "./navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
      userExistsInDatabase(session?.user.id || "").then((res) => {
        if (res) {
          return;
        } else {
          insertUserToDatabase(
            session?.user.id || "",
            session?.user.email || "",
            session?.user.user_metadata.full_name || ""
          );
          data.subscription.unsubscribe();
        }
      });
    }
  });

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
