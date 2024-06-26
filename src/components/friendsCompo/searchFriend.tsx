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
import { useEffect, useState } from "react";
import {
  addFriend,
  searchUsersByName,
} from "../../supabase/lib/friendshipLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";
import { useToast } from "../ui/use-toast";

export const SearchFriend = ({ clientAuthId }: { clientAuthId: string }) => {
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchedUsers([]);
    searchUsersByName(event.target.value).then((res) => {
      setSearchedUsers(res);
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Make new friendship</CardTitle>
        <CardDescription>Add your friends here</CardDescription>
        <form className="w-full pt-2">
          <Input placeholder="Name" type="text" onChange={handleSearch} />
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
              <Friend
                key={user.id}
                clientAuthId={clientAuthId}
                userAuthId={user.userauthid}
                name={user.name}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface SearchFriendProps {
  clientAuthId: string;
  userAuthId: string;
  name: string;
}

function Friend({ clientAuthId, userAuthId, name }: SearchFriendProps) {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    getUserAvatar(userAuthId).then((res) => {
      setAvatar(res);
    });
  }, [userAuthId]);

  function addFriendship() {
    addFriend(clientAuthId, userAuthId).then((res) => {
      if (res) {
        toast({
          title: "error",
          description: "error updating display name",
        });
      } else {
        toast({
          title: "Friend added",
          description: "You and " + name + " are now friends",
        });
      }
    });
  }

  if (clientAuthId === userAuthId) {
    return null;
  } else {
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
