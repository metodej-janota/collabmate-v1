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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
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
          props: {
            full: [
              {
                propType: string;
                x: number;
                y: number;
                heading: string;
                text: string;
                color: string;
              }
            ];
            tablet: [
              {
                propType: string;
                x: number;
                y: number;
                heading: string;
                text: string;
                color: string;
              }
            ];
            mobile: [
              {
                propType: string;
                x: number;
                y: number;
                heading: string;
                text: string;
                color: string;
              }
            ];
          };
        }
      ];
    };
    created_at: string;
  };
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [authId, setAuthId] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [programmerName, setProgrammerName] = useState<string>("");
  const [fullJSON, setFullJSON] = useState<{
    sites: {
      props: any;
      url: string;
    }[];
  } | null>(null);
  const [resolution, setResolution] = useState("w-full");
  const [propType, setPropType] = useState("textProp");
  const [open, setOpen] = React.useState(false);
  const [activeSiteUrl, setActiveSiteUrl] = useState<string>("");
  const [indexOfSite, setIndexOfSite] = useState<number>(0);
  const [newPageUrl, setNewPageUrl] = useState<string>("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

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
  }, [project]);

  const mobile = "w-[412px]";
  const tablet = "w-[1024px]";
  const full = "w-full";

  const handleChangeResolution = (value: string) => {
    setResolution(value);
  };

  const handleCreateProps = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setFullJSON((prev) => {
      if (!prev) return null;

      const newFullJSON = JSON.parse(JSON.stringify(prev));
      const site = newFullJSON.sites[indexOfSite];
      const prop = { x, y, heading: "", text: "" };

      if (resolution === mobile) {
        site.props.mobile.push(prop);
      } else if (resolution === tablet) {
        site.props.tablet.push(prop);
      } else {
        site.props.full.push(prop);
      }

      return newFullJSON;
    });
  };

  const handleInputChange = (
    index: number,
    field: string,
    value: string,
    res: string
  ) => {
    setFullJSON((prev) => {
      if (!prev) return null;

      const newFullJSON = JSON.parse(JSON.stringify(prev));
      const site = newFullJSON.sites[indexOfSite];
      const prop =
        res === mobile
          ? site.props.mobile[index]
          : res === tablet
          ? site.props.tablet[index]
          : site.props.full[index];

      prop[field] = value;

      return newFullJSON;
    });
  };

  const handleSaveChanges = async () => {
    if (!fullJSON) return;

    try {
      const { error } = await supabase
        .from("projects")
        .update({ project_props: fullJSON })
        .eq("id", project.id);

      if (error) {
        toast({
          title: "Error updating project props",
          description: "An error occurred while updating project props",
        });
      } else {
        toast({
          title: "Project props updated successfully",
          description: "Your changes have been saved.",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating project props",
        description: "An error occurred while updating project props",
      });
    }
  };

  const handleAddNewPage = () => {
    if (!newPageUrl.trim()) return;

    setFullJSON((prev) => {
      if (!prev) return null;

      const newFullJSON = JSON.parse(JSON.stringify(prev));
      newFullJSON.sites.push({
        url: newPageUrl,
        props: { full: [], tablet: [], mobile: [] },
      });

      setNewPageUrl("");

      toast({
        title: "New page created",
        description: "You have successfully created a new page",
      });

      return newFullJSON;
    });
  };

  const handleDeletePage = async () => {
    if (deleteConfirmation !== activeSiteUrl) return;

    setFullJSON((prev) => {
      if (!prev) return null;

      const newFullJSON = prev.sites.filter(
        (site) => site.url !== activeSiteUrl
      );

      toast({
        title: "Page deleted",
        description: "You have successfully deleted the page",
      });

      return { sites: newFullJSON };
    });

    setDeleteConfirmation("");
    setActiveSiteUrl("");
    setModalOpen(false);
    await handleSaveChanges();
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
                  Project created at:{" "}
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
                  <span className="text-orange-500">{customerName}</span>
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
            <Card className="col-span-3 row-span-3 row-start-4">
              <CardContent>
                <CardTitle className="text-4xl font-bold mt-4">
                  Project settings
                </CardTitle>
                <div className="mt-2 flex flex-col gap-8">
                  <div className="flex flex-col gap-2">
                    <p>Selected site</p>
                    <div className="flex gap-2">
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
                                    onSelect={(siteUrl) => {
                                      setActiveSiteUrl(siteUrl as string);
                                      setIndexOfSite(index);
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
                      <Dialog open={modalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            onClick={() => setModalOpen(true)}
                          >
                            Delete site
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Delete {activeSiteUrl} site
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this site?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-2 mt-2">
                            <p>
                              To confirm, type {`"`}
                              {activeSiteUrl}
                              {`"`} in the box below{" "}
                            </p>
                            <Input
                              id="name"
                              placeholder={activeSiteUrl}
                              className="col-span-3"
                              value={deleteConfirmation}
                              onChange={(e) =>
                                setDeleteConfirmation(e.target.value)
                              }
                            />
                            <Button
                              variant="destructive"
                              onClick={handleDeletePage}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>Create new page:</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Page url (without https://)"
                        value={newPageUrl}
                        onChange={(e) => setNewPageUrl(e.target.value)}
                      />
                      <Button onClick={handleAddNewPage}>Create site</Button>
                    </div>
                  </div>
                  <div>
                    <p>Toolbar:</p>
                    <div className="flex gap-6 mt-2">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleChangeResolution(full)}
                          variant={`${
                            resolution === full ? "default" : "outline"
                          }`}
                        >
                          <Laptop />
                        </Button>
                        <Button
                          onClick={() => handleChangeResolution(tablet)}
                          variant={`${
                            resolution === tablet ? "default" : "outline"
                          }`}
                        >
                          <Tablet />
                        </Button>
                        <Button
                          onClick={() => handleChangeResolution(mobile)}
                          variant={`${
                            resolution === mobile ? "default" : "outline"
                          }`}
                        >
                          <Smartphone />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => setPropType("textProp")}
                          variant={`${
                            propType === "textProp" ? "default" : "outline"
                          }`}
                        >
                          Text prop
                        </Button>
                        <Button
                          onClick={() => setPropType("colorProp")}
                          variant={`${
                            propType === "colorProp" ? "default" : "outline"
                          }`}
                        >
                          Color prop
                        </Button>
                      </div>
                      <Button onClick={handleSaveChanges} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {activeSiteUrl !== "" && (
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
                    {resolution === mobile &&
                      fullJSON?.sites[indexOfSite].props?.mobile?.map(
                        (prop: any, index: any) => (
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
                        )
                      )}
                    {resolution === tablet &&
                      fullJSON?.sites[indexOfSite].props?.tablet?.map(
                        (prop: any, index: any) => (
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
                        )
                      )}
                    {resolution === full &&
                      fullJSON?.sites[indexOfSite].props?.full?.map(
                        (prop: any, index: any) => (
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
                        )
                      )}
                  </div>
                  <iframe
                    className={`${resolution} h-[10000px]`}
                    src={"https://" + activeSiteUrl}
                    title={project.project_name}
                  ></iframe>
                </div>
              </Card>
            </div>
          )}
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
