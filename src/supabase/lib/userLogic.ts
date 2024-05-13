import { supabase } from "../supabase";

const changeUserDisplayName = async (name: string) => {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: name },
  });

  if (error) {
    console.error(error.message);
    return error;
  }
};

const changeUserEmail = async (email: string) => {
  const { data, error } = await supabase.auth.updateUser({
    email: email,
  });

  if (error) {
    console.error(error.message);
    return error;
  }
};

const checkFileExists = async (userId: string) => {
  const { data, error } = await supabase.storage.from("users").list("avatars", {
    limit: 100,
    offset: 0,
    search: `user_${userId}`,
  });

  if (error) {
    return error;
  }

  if (data != undefined && data.length > 0) {
    return true;
  } else {
    return false;
  }
};

const getUserAvatar = async (userId: string) => {
  const exists = checkFileExists(userId);

  if ((await exists) == false) {
    return "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg";
  } else {
    const { data } = supabase.storage
      .from("users")
      .getPublicUrl(`avatars/user_${userId}`);

    return data.publicUrl;
  }
};

const uploadAvatar = async (userId: string, image: File) => {
  checkFileExists(userId).then(async (res) => {
    if (res) {
      updateAvatar(userId, image);
    } else {
      const { data, error } = await supabase.storage
        .from("users")
        .upload(`avatars/user_${userId}`, image);

      if (error) {
        return error;
      }
    }
  });
};

const updateAvatar = async (userId: string, image: File) => {
  const { data, error } = await supabase.storage
    .from("users")
    .update(`avatars/user_${userId}`, image, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    return error;
  }
};

const deleteAvatar = async (userId: string) => {
  const { data, error } = await supabase.storage
    .from("users")
    .remove([`avatars/user_${userId}`]);

  if (error) {
    return error;
  }
};

export {
  changeUserDisplayName,
  changeUserEmail,
  checkFileExists,
  deleteAvatar,
  getUserAvatar,
  uploadAvatar,
};
