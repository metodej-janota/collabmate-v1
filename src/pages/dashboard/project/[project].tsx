"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getThisProject } from "@/supabase/lib/projectLogic";
import { supabase } from "@/supabase/supabase";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Project = ({
  project,
}: {
  project: {
    id: string;
    project_name: string;
    project_url: string;
    programmer: string;
    customer: string;
    created_at: string;
  };
}) => {
  const router = useRouter();
  const [authId, setAuthId] = useState<string>("");
  const [resolution, setResolution] = useState("w-full");
  const [buttonsMobile, setButtonsMobile] = useState<
    { x: number; y: number }[]
  >([]);
  const [buttonsTablet, setButtonsTablet] = useState<
    { x: number; y: number }[]
  >([]);
  const [buttonsFull, setButtonsFull] = useState<{ x: number; y: number }[]>(
    []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
    };

    fetchData();

    document.addEventListener("keydown", openSheetOnTabulatorPress);
    return () => {
      document.removeEventListener("keydown", openSheetOnTabulatorPress);
    };
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  /* 
        <div className="pt-20 w-[70%] m-auto">
        {project.id}
        <br />
        {project.project_name}
        <br />
        {project.project_url}
        <br />
        {project.programmer}
        <br />
        {project.customer}
        <br />
        {project.created_at}
        <br />
      </div>
  */

  const handleCreateProps = (e: React.MouseEvent) => {
    console.log(e);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (resolution === "w-[412px]") {
      setButtonsMobile([...buttonsMobile, { x, y }]);
    } else if (resolution === "w-[1024px]") {
      setButtonsTablet([...buttonsTablet, { x, y }]);
    } else {
      setButtonsFull([...buttonsFull, { x, y }]);
    }
  };

  function openSheetOnTabulatorPress(e: KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      if (open) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }
  }

  const mobile = "w-[412px]";
  const tablet = "w-[1024px]";
  const full = "w-full";
  const handleChangeResolution = (value: string) => {
    setResolution(value);
  };

  if (project.customer === authId || project.programmer === authId) {
    return (
      <>
        <Sheet open={open}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <div className="flex min-h-screen w-full flex-col mt-auto pt-20 lg:pt-0">
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-2 md:pl-20 md:pt-20">
            <Card className="p-4 hidden lg:block">
              <div className="flex gap-2">
                <Button onClick={() => handleChangeResolution(mobile)}>
                  <Smartphone />
                </Button>
                <Button onClick={() => handleChangeResolution(tablet)}>
                  <Tablet />
                </Button>
                <Button onClick={() => handleChangeResolution(full)}>
                  <Laptop />
                </Button>
              </div>
            </Card>
            <Card className="p-2">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  className="z-30 w-full h-[10000px]"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={handleCreateProps}
                >
                  {resolution === "w-[412px]" &&
                    buttonsMobile.map((button, index) => (
                      <div
                        key={index}
                        className="absolute z-40 bg-red-500 w-4 h-4 rounded-full"
                        style={{
                          top: button.y,
                          left: button.x,
                        }}
                      ></div>
                    ))}
                  {resolution === "w-[1024px]" &&
                    buttonsTablet.map((button, index) => (
                      <div
                        key={index}
                        className="absolute z-40 bg-red-500 w-4 h-4 rounded-full"
                        style={{
                          top: button.y,
                          left: button.x,
                        }}
                      ></div>
                    ))}
                  {resolution === "w-full" &&
                    buttonsFull.map((button, index) => (
                      <div
                        key={index}
                        className="absolute z-40 bg-red-500 w-4 h-4 rounded-full"
                        style={{
                          top: button.y,
                          left: button.x,
                        }}
                      ></div>
                    ))}
                </div>
                <iframe
                  className={`${resolution} h-[10000px]`}
                  src={`https://metodejjanota.cz`}
                  title={project.project_name}
                ></iframe>
              </div>
            </Card>
          </main>
        </div>
      </>
    );
  } else {
    return (
      <div className="pt-20 w-[70%] m-auto">
        <h1>Access denied</h1>
      </div>
    );
  }
};

export async function getServerSideProps({
  params,
}: {
  params: { project: string };
}) {
  const { project } = params;
  const response = await getThisProject(project);

  if (!response || response == null || response == undefined) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      project: response,
    },
  };
}

export default Project;
