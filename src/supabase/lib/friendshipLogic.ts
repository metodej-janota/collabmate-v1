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
  const friendsData = [];

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .filter("user1", "eq", user1);

  friendsData.push(data);

  const { data: data2, error: error2 } = await supabase
    .from("friendships")
    .select("*")
    .filter("user2", "eq", user1);

  friendsData.push(data2);

  if (error || error2) {
    console.error(error?.message || error2?.message);
  }

  return friendsData.flat();
};

export { addFriend, allFriends, removeFriend, searchUsersByName };
