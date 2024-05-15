import { AllFriends } from "@/components/friendsCompo/allFriends";
import { SearchFriend } from "@/components/friendsCompo/searchFriend";
import { useEffect, useState } from "react";
import withAuth from "../../supabase/protectedRoutes";
import { supabase } from "../../supabase/supabase";

function Friendships() {
  const [authId, setAuthId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 pt-20">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <AllFriends authId={authId} />
            <SearchFriend clientAuthId={authId} />
          </main>
        </div>
      </div>
    </>
  );
}

export default withAuth(Friendships);
