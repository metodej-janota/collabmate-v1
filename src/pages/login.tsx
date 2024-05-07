import { Button } from "../components/ui/button";
import { githubLogIn, isUserLoggedIn } from "../supabase/lib/authLogic";

export default function Login() {
  return (
    <div className="h-screen flex flex-col">
      <div className="m-auto gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
          Log in to CollabMate
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 mt-6">
            <Button onClick={githubLogIn}>Github</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
