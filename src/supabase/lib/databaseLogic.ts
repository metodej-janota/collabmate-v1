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

export { insertUserToDatabase, userExistsInDatabase };
