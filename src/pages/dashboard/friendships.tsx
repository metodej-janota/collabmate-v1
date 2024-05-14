import { useEffect, useState } from "react";
import {
  addFriend,
  allFriends,
  removeFriend,
  searchUsersByName,
} from "../../supabase/lib/friendshipLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";
import withAuth from "../../supabase/protectedRoutes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { supabase } from "../../supabase/supabase";

import { AllFriends } from "@/components/friendsCompo/allFriends";
import { SearchFriend } from "@/components/friendsCompo/searchFriend";

function Friendships() {
  const [authId, setAuthId] = useState<string>("");
  const [friends, setFriends] = useState<any[]>([]);

  function removeFriendship(id: string, userAuthId1: string) {
    removeFriend(id, userAuthId1);
  }

  useEffect(() => {
    allFriends(authId).then((res) => {
      setFriends(res as any[]);
    });

    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
    };

    fetchData();
  });

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
