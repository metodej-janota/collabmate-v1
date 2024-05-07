import { use, useEffect, useState } from "react";
import { supabase } from "../supabase";

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

const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    console.log("GitHub logout successful");
  }

  if (error) console.error("GitHub logout error:", error.message);
};

const getUseSessionInfo = async () => {
  const userData = [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  userData.push(user);

  return userData;
};

export { getUseSessionInfo, githubLogIn, logOut };
