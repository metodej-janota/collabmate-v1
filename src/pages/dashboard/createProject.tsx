import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import withAuth from "../../supabase/protectedRoutes";
import { supabase } from "../../supabase/supabase";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { allFriends } from "@/supabase/lib/friendshipLogic";
import Image from "next/image";
import Link from "next/link";
import { getNameById } from "../../supabase/lib/databaseLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";

function CreateProject() {
  const [authId, setAuthId] = useState<string>("");
  const [friends, setFriends] = useState<any[]>([]);

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
    <div className="pt-20">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Create new project!</CardTitle>
                <CardDescription>
                  Manage your products and view their sales performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="name">Project name</Label>
                    <Input id="name" type="text" placeholder="School web" />
                  </div>
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
                          <TableRow key={friend.id}>
                            <Friend key={friend.id} userAuthId={friend.user2} />
                            <TableCell>
                              <Button
                                onClick={() => console.log(friend.authId)}
                              >
                                Invite
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={friend.id}>
                            <Friend key={friend.id} userAuthId={friend.user1} />
                            <TableCell>
                              <Button>Invite</Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

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
    <>
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
    </>
  );
}

export default withAuth(CreateProject);
