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

export { getThisProject };
