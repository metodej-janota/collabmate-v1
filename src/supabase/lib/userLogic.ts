import { supabase } from "../supabase";

const changeUserDisplayName = async (name: string) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: name },
  });

  if (error) {
    console.error("Error updating user:", error.message);
    return error;
  }
};

const changeUserEmail = async (email: string) => {
  const { data, error } = await supabase.auth.updateUser({
    email: "new@email.com",
  });

  if (error) {
    console.error("Error updating user:", error.message);
    return error;
  }
};

export { changeUserDisplayName, changeUserEmail };
