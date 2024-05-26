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
import { useToast } from "../../components/ui/use-toast";
import { getNameById } from "../../supabase/lib/databaseLogic";
import { createProject } from "../../supabase/lib/projectLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";

function CreateProject() {
  const { toast } = useToast();
  const [authId, setAuthId] = useState<string>("");
  const [friends, setFriends] = useState<any[]>([]);

  const [projectName, setProjectName] = useState<string>("");
  const [selectedFriend, setSelectedFriend] = useState<string>("");

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

  function handleCreateProject() {
    if (
      projectName === "" ||
      projectName === undefined ||
      projectName === null ||
      selectedFriend === "" ||
      selectedFriend === undefined ||
      selectedFriend === null
    ) {
      toast({
        title: "error",
        description: "Project name or friend can't be empty",
      });
      return;
    }
    createProject(projectName, authId, selectedFriend).then((res) => {
      if (res) {
        toast({
          title: "error",
          description: "Error creating project",
        });
      } else {
        toast({
          title: "Project created",
          description: "Project " + projectName + " successfully created!",
        });
      }
    });
  }

  return (
    <div className="pt-20">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Create new project!</CardTitle>
                <CardDescription>
                  Create a new project and invite your friends!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="School web"
                      onChange={(e) => setProjectName(e.target.value)}
                    />
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
                                onClick={() => setSelectedFriend(friend.user2)}
                              >
                                Invite
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          <TableRow key={friend.id}>
                            <Friend key={friend.id} userAuthId={friend.user1} />
                            <TableCell>
                              <Button
                                onClick={() => setSelectedFriend(friend.user1)}
                              >
                                Invite
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  <Button onClick={handleCreateProject}>Create project</Button>
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
