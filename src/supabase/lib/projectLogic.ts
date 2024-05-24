import { supabase } from "../supabase";

const getThisProject = async (project_url: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("project_url", project_url);

  if (error) {
    console.error(error.message);
  }

  if (!data) {
    return null;
  }

  return data[0];
};

const createProject = async (
  name: string,
  programmer: string,
  customer: string
) => {
  const { data, error } = await supabase.from("projects").insert({
    project_name: name,
    programmer: programmer,
    customer: customer,
    project_url:
      name
        .replace(/\s/g, "-")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") +
      "-" +
      (Math.random() * 1000000).toFixed(0),
    created_at: new Date(),
    project_props: {
      sites: [],
    },
  });

  if (error) {
    return error;
  }
};

const getAllMyProgrammerProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("programmer", userId);

  if (error) {
    console.error(error.message);
  }

  return data;
};

const getAllMyCustomerProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("customer", userId);

  if (error) {
    console.error(error.message);
  }

  return data;
};

const deleteProject = async (projectId: number) => {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error(error.message);
    return error;
  }
};

const getMessages = async (projectId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error.message);
  }

  return data;
};

export {
  createProject,
  deleteProject,
  getAllMyCustomerProjects,
  getAllMyProgrammerProjects,
  getMessages,
  getThisProject,
};
