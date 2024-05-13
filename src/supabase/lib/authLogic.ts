import { create } from "domain";
import { supabase } from "../supabase";

const registerWithEmail = async (
  name: string,
  email: string,
  password: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  insertUserToDatabase(data.user?.id || "", email, name);
  console.log(data.user?.id || "", email, name);

  if (error) {
    return error.message;
  }
};

const insertUserToDatabase = async (
  userAuthId: string,
  email: string,
  name: string
) => {
  const { error } = await supabase.from("users").insert({
    user_auth_id: userAuthId,
    email: email,
    name: name,
    created_at: new Date(),
  });

  if (error) {
    console.error(error.message);
  }
};

const logInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    return error.message;
  }
};

const githubLogIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });

  if (!error) {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        console.log("logined");
      }
    });
  }

  if (error) console.error(error.message);
};

const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    location.reload();
  }

  if (error) console.error(error.message);
};

const getUseSessionInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user;

  return userData;
};

export {
  getUseSessionInfo,
  githubLogIn,
  logInWithEmail,
  logOut,
  registerWithEmail,
};
