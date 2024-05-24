import { useEffect, useState } from "react";
import { getNameById } from "../../supabase/lib/databaseLogic";
import { getUserAvatar } from "../../supabase/lib/userLogic";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type MessageProps = {
  authId: string;
  name: string;
  message: string;
};

const Message = ({ authId, name, message }: MessageProps) => {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>(name);

  useEffect(() => {
    const fetchData = async () => {
      if (name !== "You") {
        const programmerName = await getNameById(name);
        setNewName(programmerName);
      }
    };
    getUserAvatar(authId).then((res) => {
      setAvatar(res);
    });

    fetchData();
  }, [authId, name]);

  if (name == "You") {
    return (
      <div className="p-1 flex gap-1 bg-orange-100 rounded-md">
        {avatar && (
          <Avatar className="aspect-square rounded-full object-cover w-10 h-10">
            <AvatarImage src={avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        <p className="my-auto font-semibold">{newName}:</p>
        <p className="my-auto"> {message}</p>
      </div>
    );
  } else {
    return (
      <div className="p-2 flex gap-1 rounded-md">
        {avatar && (
          <Avatar className="aspect-square rounded-full object-cover w-10 h-10">
            <AvatarImage src={avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
        <p className="my-auto font-semibold">{newName}:</p>
        <p className="my-auto"> {message}</p>
      </div>
    );
  }
};

export default Message;
