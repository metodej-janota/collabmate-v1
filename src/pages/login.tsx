import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import ErrorComponent from "../components/util/errorComponent";
import { githubLogIn, logInWithEmail } from "../supabase/lib/authLogic";
import { supabase } from "../supabase/supabase";

export default function Login() {
  const router = useRouter();
  const [logined, setLogined] = useState(false);

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  supabase.auth.onAuthStateChange((_, session) => {
    if (session == undefined) {
      setLogined(false);
    } else {
      setLogined(true);
    }
  });

  function handleLogin() {
    logInWithEmail(email, password).then((res) => {
      if (res) {
        setError(res);
      } else {
        router.push("/dashboard/dashboard");
      }
    });
  }

  return (
    <>
      {logined ? (
        <ErrorComponent error="Již jste přihlášení" />
      ) : (
        <div className="h-screen flex flex-col">
          <div className="m-auto gap-4">
            <Card className="mx-auto max-w-sm w-[500px]">
              <CardHeader>
                <CardTitle className="text-xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </div>
                  <CardDescription className="text-red-600">
                    {error}
                  </CardDescription>
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={githubLogIn}
                  >
                    Login in with GitHub
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Dont have an account?{" "}
                  <Link href="/register" className="underline">
                    Sign up
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
