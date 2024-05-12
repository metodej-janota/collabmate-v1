import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  changeUserDisplayName,
  changeUserEmail,
  getUserAvatar,
  uploadAvatar,
} from "../../../supabase/lib/userLogic";
import withAuth from "../../../supabase/protectedRoutes";
import { supabase } from "../../../supabase/supabase";

function Settings() {
  const { toast } = useToast();

  const [userId, setUserId] = useState("");
  const [provider, setProvider] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setProvider(session.data.session?.user.app_metadata?.provider || "");
      setDisplayName(session.data.session?.user.user_metadata.full_name || "");
      setEmail(session.data.session?.user.email || "");
      setUserId(session.data.session?.user.id || "");
      setAvatar(await getUserAvatar(session.data.session?.user.id || ""));
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex min-h-screen w-full flex-col mt-auto">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] mt-[100px]">
            <nav
              className="grid gap-4 text-sm text-muted-foreground"
              x-chunk="dashboard-04-chunk-0"
            >
              <Link href="#" className="font-semibold text-primary">
                General settings
              </Link>
            </nav>
            <div className="grid gap-6">
              {provider === "github" && (
                <p className="text-red-600">
                  You signed up with GitHub. You cant change your informations.
                </p>
              )}
              <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                  <CardTitle>Profile avatar</CardTitle>
                  <CardDescription>
                    The picture that will be displayed on your store.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                  <div className="flex w-full">
                    <Image
                      className="rounded-full w-40 h-40 object-cover"
                      src={
                        avatar ||
                        "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
                      }
                      width={200}
                      height={200}
                      alt="avatar"
                      priority={true}
                      fetchPriority="high"
                      loader={({ src }) => src}
                      loading="eager"
                      unoptimized
                    />
                    <form className="w-full">
                      <Input
                        placeholder="Email"
                        disabled={provider === "github"}
                        type="file"
                        onChange={(e) => {
                          if (e.target.files) {
                            const file = e.target.files[0];
                            uploadAvatar(userId, file);
                            setAvatar(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </form>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button disabled={provider === "github"}>Save</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                  <CardTitle>Display name</CardTitle>
                  <CardDescription>
                    The name that will be displayed on your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <Input
                      placeholder="Display Name"
                      disabled={provider === "github"}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button
                    disabled={provider === "github"}
                    onClick={async () => {
                      await changeUserDisplayName(displayName).then((res) => {
                        if (res) {
                          toast({
                            title: "error",
                            description: "error updating display name",
                          });
                        } else {
                          toast({
                            title: "Display name updated",
                            description: "to " + displayName,
                          });
                        }
                      });
                    }}
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                  <CardTitle>Email</CardTitle>
                  <CardDescription>
                    The email address you use to sign in.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <Input
                      placeholder="Email"
                      disabled={provider === "github"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </form>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button
                    disabled={provider === "github"}
                    onClick={async () => {
                      await changeUserEmail(email).then((res) => {
                        if (res) {
                          toast({
                            title: "error",
                            description: "error updating email",
                          });
                        } else {
                          toast({
                            title: "Email updated",
                            description: "to " + email,
                          });
                        }
                      });
                    }}
                  >
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default withAuth(Settings);
