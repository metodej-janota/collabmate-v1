import Link from "next/link";
import { Button } from "../ui/button";

const ErrorComponent = ({ error }: { error: string }) => {
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="m-auto gap-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl">
            {error}
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 mt-6">
              <Button>
                <Link href="/">Zpět na úvodní stránku</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorComponent;
