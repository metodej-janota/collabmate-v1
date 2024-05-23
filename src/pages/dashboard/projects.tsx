import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getNameById } from "../../supabase/lib/databaseLogic";
import {
  deleteProject,
  getAllMyCustomerProjects,
  getAllMyProgrammerProjects,
} from "../../supabase/lib/projectLogic";
import withAuth from "../../supabase/protectedRoutes";
import { supabase } from "../../supabase/supabase";

function Projects() {
  const [authId, setAuthId] = useState<string>("");
  const [programmingProjects, setProgrammerProjects] = useState<any[]>([]);
  const [customerProjects, setCustomerProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
      getAllMyProgrammerProjects(authId).then((res) => {
        setProgrammerProjects(res as any[]);
      });
      getAllMyCustomerProjects(authId).then((res) => {
        setCustomerProjects(res as any[]);
      });
    };

    fetchData();
  });

  return (
    <div className="pt-20">
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>All my projects</CardTitle>
                <CardDescription>Manage your projects here</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project name</TableHead>
                      <TableHead>Programmer</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programmingProjects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        userAuthId={authId}
                        projectData={project}
                      />
                    ))}

                    {customerProjects.map((project) => (
                      <ProjectRow
                        key={project.id}
                        userAuthId={authId}
                        projectData={project}
                      />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}

interface projectsProps {
  userAuthId: string;
  projectData: {
    id: number;
    project_name: string;
    programmer: string;
    customer: string;
    project_url: string;
    created_at: string;
  };
}

function ProjectRow({ userAuthId, projectData }: projectsProps) {
  const [programmerName, setProgrammerName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    getNameById(projectData.programmer).then((res) => {
      setProgrammerName(res);
    });
    getNameById(projectData.customer).then((res) => {
      setCustomerName(res);
    });
  });

  const deleteThisProject = async (projectId: number) => {
    deleteProject(projectId).then(() => {
      toast({
        title: "Project deleted",
        description: "The project was successfully deleted",
      });
      router.replace("/dashboard/projects");
    });
  };

  return (
    <TableRow key={projectData.id}>
      <TableCell>{projectData.project_name}</TableCell>
      <TableCell>{programmerName}</TableCell>
      <TableCell>{customerName}</TableCell>
      <TableCell>
        {new Date(projectData.created_at).toLocaleDateString("en-GB")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                router.replace("/dashboard/project/" + projectData.project_url)
              }
            >
              Open
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteProject(projectData.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default withAuth(Projects);
