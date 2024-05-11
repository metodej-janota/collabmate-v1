import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { githubLogIn } from "@/supabase/lib/authLogic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ErrorComponent from "../components/util/errorComponent";
import { supabase } from "../supabase/supabase";

export default function Register() {
  const router = useRouter();
  const [logined, setLogined] = useState(false);

  supabase.auth.onAuthStateChange((_, session) => {
    if (session == undefined) {
      setLogined(false);
    } else {
      setLogined(true);
    }
  });

  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister() {
    registerWithEmail(name, email, password);
  }

  const registerWithEmail = async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      return error.message;
    } else {
      router.replace("/login");
    }
  };

  return (
    <>
      {logined ? (
        <>
          <ErrorComponent error="Již jste přihlášení" />
        </>
      ) : (
        <div className="h-screen flex flex-col">
          <div className="m-auto gap-4">
            <Card className="mx-auto max-w-sm w-[500px]">
              <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Display name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Johny Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <CardDescription className="text-red-600">
                    {error}
                  </CardDescription>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleRegister}
                  >
                    Create an account
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={githubLogIn}
                  >
                    Sign up with GitHub
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
