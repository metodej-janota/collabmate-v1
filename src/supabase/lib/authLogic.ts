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

  if (error) {
    return error.message;
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
        console.log("Loggined");
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
