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

function Friendships() {
  const [authId, setAuthId] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchedUsers([]);
    searchUsersByName(event.target.value).then((res) => {
      setSearchedUsers(res);
    });
  }

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
            <Card>
              <CardHeader>
                <CardTitle>Make new friendship</CardTitle>
                <CardDescription>Add your friends here</CardDescription>
                <form className="w-full pt-2">
                  <Input
                    placeholder="Name"
                    type="text"
                    onChange={handleSearch}
                  />
                </form>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        Avatar
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchedUsers.map((user) => (
                      <SearchFriend
                        key={user.id}
                        id={authId}
                        userAuthId={user.userauthid}
                        name={user.name}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your friendships</CardTitle>
                <CardDescription>All your friendships</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        Avatar
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {friends.map((friend) => (
                      <TableRow key={friend.friend_id}>
                        <TableCell className="hidden sm:table-cell">
                          <Image
                            alt="user avatar"
                            className="aspect-square rounded-md object-cover"
                            height={64}
                            src=""
                            width={64}
                          />
                        </TableCell>
                        <TableCell className="font-medium">Friend</TableCell>
                        <TableCell>Friend</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  removeFriendship(authId, friend.friend_id)
                                }
                              >
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
}

interface SearchFriendProps {
  id: string;
  userAuthId: string;
  name: string;
}

function SearchFriend({ id, userAuthId, name }: SearchFriendProps) {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getUserAvatar(userAuthId).then((res) => {
      setAvatar(res);
    });
  }, [userAuthId]);

  function addFriendship() {
    addFriend(id, userAuthId);
  }

  if (id === userAuthId) {
    return null;
  } else {
    return (
      <TableRow key={userAuthId}>
        <TableCell className="hidden sm:table-cell">
          {avatar && (
            <Image
              alt="user avatar"
              className="aspect-square rounded-md object-cover"
              height={64}
              src={avatar}
              width={64}
            />
          )}
        </TableCell>
        <TableCell className="font-medium">{name}</TableCell>
        <TableCell>Stranger</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={addFriendship}>Add</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  }
}

export default withAuth(Friendships);
