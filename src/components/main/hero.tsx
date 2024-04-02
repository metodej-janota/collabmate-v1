import { motion } from "framer-motion";
import { ArrowRight, SquarePlus } from "lucide-react";
import { Button } from "../ui/button";

export const Hero = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="m-auto text-center gap-4">
        <p className="leading-7">Applica</p>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
          CollabMate
        </h1>
        <p className="text-xl text-muted-foreground">
          A modal dialog that interrupts the user with important content and
          expects a response.
        </p>
        <div className="flex gap-4 mt-6">
          <Button>
            Přihlásit se <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SquarePlus />
          </Button>
        </div>
      </div>
    </div>
  );
};
