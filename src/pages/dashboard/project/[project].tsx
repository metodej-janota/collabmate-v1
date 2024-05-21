"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getThisProject } from "@/supabase/lib/projectLogic";
import { supabase } from "@/supabase/supabase";
import { Laptop, Smartphone, Tablet, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [authId, setAuthId] = useState<string>("");
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
  const [fullJSON, setFullJSON] = useState<{
    sites: {
      props: any;
      url: string;
    }[];
  } | null>(null);
  const [activeSiteUrl, setActiveSiteUrl] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
      setFullJSON(project.project_props);

      if (project.project_props && project.project_props.sites.length > 0) {
        const firstSite = project.project_props.sites[0];
        setActiveSiteUrl(firstSite.url);
        setPropsFull(firstSite.props);
      }
    };
    fetchData();

    document.addEventListener("keydown", openSheetOnTabulatorPress);
    return () => {
      document.removeEventListener("keydown", openSheetOnTabulatorPress);
    };
  }, [project.project_props]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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

  function openSheetOnTabulatorPress(e: KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpen(!open);
    }
  }

  const handleSiteChange = (url: string, siteIndex: number) => {
    setActiveSiteUrl(url);
    const siteProps = fullJSON?.sites[siteIndex]?.props || [];

    if (resolution === "w-[412px]") {
      setPropsMobile(siteProps);
    } else if (resolution === "w-[1024px]") {
      setPropsTablet(siteProps);
    } else {
      setPropsFull(siteProps);
    }
  };

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

  const handleSave = async () => {
    if (fullJSON) {
      const updatedSites = fullJSON.sites.map((site) => {
        if (site.url === activeSiteUrl) {
          return {
            ...site,
            props:
              resolution === "w-[412px]"
                ? propsMobile
                : resolution === "w-[1024px]"
                ? propsTablet
                : propsFull,
          };
        }
        return site;
      });

      const updatedFullJSON = { ...fullJSON, sites: updatedSites };
      setFullJSON(updatedFullJSON);

      await supabase
        .from("projects")
        .update({ project_props: updatedFullJSON })
        .eq("id", project.id);
    }
  };

  if (project.customer === authId || project.programmer === authId) {
    return (
      <>
        {fullJSON != null ? (
          <Sheet open={open}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>All project sites</SheetTitle>
                <SheetDescription>
                  Click on a site to view it in and add props to it!
                </SheetDescription>
              </SheetHeader>
              <br />
              <div className="flex flex-col gap-2">
                {fullJSON.sites.map((site) => (
                  <Button
                    key={site.url}
                    variant={
                      site.url === activeSiteUrl ? "outline" : "secondary"
                    }
                    onClick={() =>
                      handleSiteChange(site.url, fullJSON.sites.indexOf(site))
                    }
                  >
                    {site.url}
                  </Button>
                ))}
                <Button onClick={() => setOpen(false)}>Create new site</Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : null}
        <div className="flex min-h-screen w-full flex-col mt-auto pt-20 lg:pt-0">
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-2 md:pl-20 md:pt-20">
            <Button onClick={handleSave}>Save Changes</Button>
            <Card className="p-4 hidden lg:block">
              <div className="flex gap-2">
                <Button onClick={() => handleChangeResolution(full)}>
                  <Laptop />
                </Button>
                <Button onClick={() => handleChangeResolution(tablet)}>
                  <Tablet />
                </Button>
                <Button onClick={() => handleChangeResolution(mobile)}>
                  <Smartphone />
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
