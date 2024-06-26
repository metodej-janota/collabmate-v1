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

export { getNameById, insertUserToDatabase, userExistsInDatabase };
