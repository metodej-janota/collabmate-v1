import { supabase } from "../supabase";

// Login with email

const logInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Email login error:", error.message);
    return error;
  }

  return data;
};

// GitHub login
const githubLogIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });

  if (!error) {
    supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        console.log("GitHub login successful");
      }
    });
  }

  if (error) console.error("GitHub login error:", error.message);
};

// Auth logout
const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    location.reload();
  }

  if (error) console.error("error:", error.message);
};

// user session info
const getUseSessionInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userData = user;

  return userData;
};

export { getUseSessionInfo, githubLogIn, logInWithEmail, logOut };
