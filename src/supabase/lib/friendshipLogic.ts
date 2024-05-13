import { supabase } from "../supabase";

const addFriend = async (user1: string, user2: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .insert([{ user1: user1, user2: user2 }]);

  if (error) {
    console.error(error.message);
  }

  return data;
};

const searchUsersByName = async (name: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .filter("name", "ilike", `%${name}%`);

  if (error) {
    console.error(error.message);
    return [];
  }

  if (data && data.length > 0) {
    return data;
  } else {
    return [];
  }
};

const removeFriend = async (user1: string, user2: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .delete()
    .eq("user1", user1)
    .eq("user2", user2);

  if (error) {
    console.error(error.message);
  }

  return data;
};

const allFriends = async (user1: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .filter("user1", "eq", user1);

  if (error) {
    console.error(error.message);
    return [];
  }

  if (data && data.length > 0) {
    return data;
  } else {
    return [];
  }
};

export { addFriend, allFriends, removeFriend, searchUsersByName };
