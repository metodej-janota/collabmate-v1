"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNameById } from "@/supabase/lib/databaseLogic";
import { getThisProject } from "@/supabase/lib/projectLogic";
import withAuth from "@/supabase/protectedRoutes";
import { supabase } from "@/supabase/supabase";
import { Laptop, Smartphone, Tablet } from "lucide-react";
import { useRouter } from "next/router";
import * as React from "react";
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
    project_props: {
      sites: [
        {
          url: string;
          props: [
            {
              x: number;
              y: number;
              heading: string;
              text: string;
            }
          ];
        }
      ];
    };
    created_at: string;
  };
}) => {
  const router = useRouter();
  const [authId, setAuthId] = useState<string>("");
  const [custommerName, setCustomerName] = useState<string>("");
  const [programmerName, setProgrammerName] = useState<string>("");
  const [fullJSON, setFullJSON] = useState<{
    sites: {
      props: any;
      url: string;
    }[];
  } | null>(null);
  const [resolution, setResolution] = useState("w-full");
  const [propsMobile, setPropsMobile] = useState<
    { x: number; y: number; heading: string; text: string }[]
  >([]);
  const [propsTablet, setPropsTablet] = useState<
    { x: number; y: number; heading: string; text: string }[]
  >([]);
  const [propsFull, setPropsFull] = useState<
    { x: number; y: number; heading: string; text: string }[]
  >([]);

  const [open, setOpen] = React.useState(false);
  const [activeSiteUrl, setActiveSiteUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
      setFullJSON(project.project_props);
      const customerName = await getNameById(project.customer);
      setCustomerName(customerName);
      const programmerName = await getNameById(project.programmer);
      setProgrammerName(programmerName);
    };
    fetchData();
  });

  const mobile = "w-[412px]";
  const tablet = "w-[1024px]";
  const full = "w-full";

  const handleChangeResolution = (value: string) => {
    setResolution(value);
    const siteIndex =
      fullJSON?.sites.findIndex((site) => site.url === activeSiteUrl) || 0;
    const siteProps = fullJSON?.sites[siteIndex]?.props || [];

    if (value === mobile) {
      setPropsMobile(siteProps);
    } else if (value === tablet) {
      setPropsTablet(siteProps);
    } else {
      setPropsFull(siteProps);
    }
  };

  const handleCreateProps = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (resolution === "w-[412px]") {
      setPropsMobile([...propsMobile, { x, y, heading: "", text: "" }]);
    } else if (resolution === "w-[1024px]") {
      setPropsTablet([...propsTablet, { x, y, heading: "", text: "" }]);
    } else {
      setPropsFull([...propsFull, { x, y, heading: "", text: "" }]);
    }
  };

  const handleInputChange = (
    index: number,
    type: "heading" | "text",
    value: string,
    resolution: string
  ) => {
    let updatedProps;
    if (resolution === "w-[412px]") {
      updatedProps = [...propsMobile];
      updatedProps[index] = { ...updatedProps[index], [type]: value };
      setPropsMobile(updatedProps);
    } else if (resolution === "w-[1024px]") {
      updatedProps = [...propsTablet];
      updatedProps[index] = { ...updatedProps[index], [type]: value };
      setPropsTablet(updatedProps);
    } else {
      updatedProps = [...propsFull];
      updatedProps[index] = { ...updatedProps[index], [type]: value };
      setPropsFull(updatedProps);
    }
  };

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  if (project.customer === authId || project.programmer === authId) {
    return (
      <div className="flex min-h-screen w-full flex-col mt-auto pt-20 lg:pt-0">
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-2 md:pl-20 md:pt-20">
          <div className="grid grid-cols-6 grid-rows-6 gap-4">
            <Card className="col-span-3 row-span-3">
              <CardContent>
                <CardTitle className="text-4xl font-bold mt-4">
                  {project.project_name}
                </CardTitle>
                <p className="mt-2">
                  Projecr created at:{" "}
                  <span className="text-orange-500">
                    {new Date(project.created_at).toLocaleDateString("en-GB")}
                  </span>
                </p>
                <p>
                  Programmer:{" "}
                  <span className="text-orange-500">{programmerName}</span>
                </p>
                <p>
                  Customer:{" "}
                  <span className="text-orange-500">{custommerName}</span>
                </p>
              </CardContent>
            </Card>
            <Card className="col-span-3 row-span-6 col-start-4">
              <CardContent>
                <CardTitle className="text-4xl font-bold mt-4">
                  Project chat
                </CardTitle>
              </CardContent>
            </Card>
            {/* 
            ██╗░░░░░░█████╗░░██████╗░██╗░█████╗░
            ██║░░░░░██╔══██╗██╔════╝░██║██╔══██╗
            ██║░░░░░██║░░██║██║░░██╗░██║██║░░╚═╝
            ██║░░░░░██║░░██║██║░░╚██╗██║██║░░██╗
            ███████╗╚█████╔╝╚██████╔╝██║╚█████╔╝
            ╚══════╝░╚════╝░░╚═════╝░╚═╝░╚════╝░
            */}
            <Card className="col-span-3 row-span-3 row-start-4">
              <CardContent>
                <CardTitle className="text-4xl font-bold mt-4">
                  Project settings
                </CardTitle>
                <div className="mt-2 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p>Selected site</p>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                        >
                          {activeSiteUrl ? (
                            <>{activeSiteUrl}</>
                          ) : (
                            <>Select your site you want to edit</>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-full"
                        side="bottom"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Change status..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {fullJSON?.sites.map((site, index) => (
                                <CommandItem
                                  key={index}
                                  value={site.url}
                                  onSelect={(site) => {
                                    setActiveSiteUrl(site as string);
                                    setOpen(false);
                                  }}
                                >
                                  <span>{site.url}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Create new page:</p>
                    <Input placeholder="Page url (without https://)" />
                    <Button className="w-full" variant={"outline"}>
                      Create
                    </Button>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleChangeResolution(full)}
                        variant={"outline"}
                      >
                        <Laptop />
                      </Button>
                      <Button
                        onClick={() => handleChangeResolution(tablet)}
                        variant={"outline"}
                      >
                        <Tablet />
                      </Button>
                      <Button
                        onClick={() => handleChangeResolution(mobile)}
                        variant={"outline"}
                      >
                        <Smartphone />
                      </Button>
                      <Button className="w-full">Save Changes</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 
          ██████╗░██████╗░░█████╗░░░░░░██╗███████╗░█████╗░████████╗
          ██╔══██╗██╔══██╗██╔══██╗░░░░░██║██╔════╝██╔══██╗╚══██╔══╝
          ██████╔╝██████╔╝██║░░██║░░░░░██║█████╗░░██║░░╚═╝░░░██║░░░
          ██╔═══╝░██╔══██╗██║░░██║██╗░░██║██╔══╝░░██║░░██╗░░░██║░░░
          ██║░░░░░██║░░██║╚█████╔╝╚█████╔╝███████╗╚█████╔╝░░░██║░░░
          ╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚════╝░╚══════╝░╚════╝░░░░╚═╝░░░
          */}
          <div className="mt-2">
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
                    propsMobile.map((prop, index) => (
                      <Card
                        key={index}
                        className="absolute z-40 bg-white border rounded p-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          top: `${prop.y}%`,
                          left: `${prop.x}%`,
                        }}
                      >
                        <Input
                          className="bg-white text-black"
                          placeholder="Heading"
                          value={prop.heading}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "heading",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                        <Input
                          className="bg-white text-black"
                          placeholder="Text"
                          value={prop.text}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "text",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                      </Card>
                    ))}
                  {resolution === "w-[1024px]" &&
                    propsTablet.map((prop, index) => (
                      <Card
                        key={index}
                        className="absolute z-40 bg-white border rounded p-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          top: `${prop.y}%`,
                          left: `${prop.x}%`,
                        }}
                      >
                        <Input
                          className="bg-white text-black"
                          placeholder="Heading"
                          value={prop.heading}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "heading",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                        <Input
                          className="bg-white text-black"
                          placeholder="Text"
                          value={prop.text}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "text",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                      </Card>
                    ))}
                  {resolution === "w-full" &&
                    propsFull.map((prop, index) => (
                      <Card
                        key={index}
                        className="absolute z-40 bg-white border rounded p-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          top: `${prop.y}%`,
                          left: `${prop.x}%`,
                        }}
                      >
                        <Input
                          className="bg-white text-black"
                          placeholder="Heading"
                          value={prop.heading}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "heading",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                        <Input
                          className="bg-white text-black"
                          placeholder="Text"
                          value={prop.text}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "text",
                              e.target.value,
                              resolution
                            )
                          }
                        />
                      </Card>
                    ))}
                </div>
                <iframe
                  className={`${resolution} h-[10000px]`}
                  src={"https://" + activeSiteUrl}
                  title={project.project_name}
                ></iframe>
              </div>
            </Card>
          </div>
        </main>
      </div>
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

export default withAuth(Project);
