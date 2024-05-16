import { supabase } from "../supabase";

const insertUserToDatabase = async (
  userAuthId: string,
  email: string,
  name: string
) => {
  const { error } = await supabase.from("users").insert({
    userauthid: userAuthId,
    email: email,
    name: name,
    created_at: new Date(),
  });

  if (error) {
    console.error(error.message);
    return error;
  }
};

const userExistsInDatabase = async (userAuthId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("userauthid", userAuthId);

  if (data != undefined && data.length > 0) {
    return "true";
  }
};

const getNameById = async (userAuthId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("userauthid", userAuthId);

  if (data != undefined && data.length > 0) {
    return data[0].name;
  }
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
      //odstranit diakritiku
      name
        .replace(/\s/g, "-")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") +
      "-" +
      (Math.random() * 1000000).toFixed(0),
    created_at: new Date(),
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

export {
  createProject,
  getAllMyCustomerProjects,
  getAllMyProgrammerProjects,
  getNameById,
  insertUserToDatabase,
  userExistsInDatabase,
};
