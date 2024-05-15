import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getNameById } from "@/supabase/lib/databaseLogic";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  addFriend,
  allFriends,
  removeFriend,
} from "../../supabase/lib/friendshipLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";

export const AllFriends = ({ authId }: { authId: string }) => {
  const [friends, setFriends] = useState<any[]>([]);

  function removeFriendship(id: string, userAuthId1: string) {
    removeFriend(id, userAuthId1);
  }

  useEffect(() => {
    allFriends(authId).then((res) => {
      setFriends(res as any[]);
    });
  });

  return (
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
            {friends.map((friend) =>
              friend.user1 == authId ? (
                <Friend key={friend.id} userAuthId={friend.user2} />
              ) : (
                <Friend key={friend.id} userAuthId={friend.user1} />
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface friendsProps {
  userAuthId: string;
}

function Friend({ userAuthId }: friendsProps) {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    getUserAvatar(userAuthId).then((res) => {
      setAvatar(res);
    });
    getNameById(userAuthId).then((res) => {
      setName(res);
    });
  }, [userAuthId]);

  return (
    <TableRow key={userAuthId}>
      <TableCell className="hidden sm:table-cell">
        {avatar && (
          <Avatar className="aspect-square rounded-full object-cover w-16 h-16">
            <AvatarImage src={avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>Friends</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Add</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
