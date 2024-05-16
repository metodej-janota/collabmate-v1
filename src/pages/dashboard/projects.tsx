import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  getAllMyProgrammerProjects,
  getNameById,
} from "../../supabase/lib/databaseLogic";
import withAuth from "../../supabase/protectedRoutes";
import { supabase } from "../../supabase/supabase";

function Projects() {
  const [authId, setAuthId] = useState<string>("");
  const [programmingProjects, setProgrammerProjects] = useState<any[]>([]);

  useEffect(() => {
    getAllMyProgrammerProjects(authId).then((res) => {
      setProgrammerProjects(res as any[]);
    });

    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      setAuthId(session.data.session?.user.id || "");
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

  useEffect(() => {
    getNameById(projectData.programmer).then((res) => {
      setProgrammerName(res);
    });
    getNameById(projectData.customer).then((res) => {
      setCustomerName(res);
    });
  });

  return (
    <TableRow
      key={projectData.id}
      className="cursor-pointer"
      onClick={() =>
        router.replace("/dashboard/project/" + projectData.project_url)
      }
    >
      <TableCell>{projectData.project_name}</TableCell>
      <TableCell>{programmerName}</TableCell>
      <TableCell>{customerName}</TableCell>
      <TableCell>
        {new Date(projectData.created_at).toLocaleDateString("en-GB")}
      </TableCell>
    </TableRow>
  );
}

export default withAuth(Projects);
