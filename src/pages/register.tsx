import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Github, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="m-auto gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
          Zaregistrujte se na CollabMate ještě dnes
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" placeholder="Email" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input type="password" id="password" placeholder="Password" />
            </div>
            <Button>Registrovat</Button>
          </div>
          <Separator />
          <Button variant="outline">
            <Link href="/" className="flex items-center">
              Zaregistrovat se přes Github <Github className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Link href="/register" className="text-muted-foreground text-center">
            Ještě nemáte účet?{" "}
            <span className="text-primary">Zaregistrujte se</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
