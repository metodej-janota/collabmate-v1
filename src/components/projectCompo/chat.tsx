import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessages } from "@/supabase/lib/projectLogic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Message from "../../components/projectCompo/message";
import { supabase } from "../../supabase/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Message {
  id: string;
  project_id: string;
  sender: string;
  content: string;
  created_at: string;
}

const Chat = ({
  project_id,
  userAuthId,
}: {
  project_id: string;
  userAuthId: string;
}) => {
  const router = useRouter();
  const { data: messages, error } = useSWR(project_id, () =>
    getMessages(project_id)
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel(`project-${project_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `project_id=eq.${project_id}`,
        },
        (payload) => {
          mutate(project_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project_id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("messages").insert([
      {
        project_id: project_id,
        sender: userAuthId,
        content: message,
      },
    ]);

    if (error) {
      console.error(error.message);
    } else {
      setMessage("");
    }

    setLoading(false);
  };

  if (error) {
    console.error(error);
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      {messages ? (
        <ScrollArea className="h-[100%] rounded-md border">
          {messages.map((message: Message) => (
            <Message
              key={message.id}
              name={message.sender === userAuthId ? "You" : message.sender}
              authId={message.sender}
              message={message.content}
            />
          ))}
        </ScrollArea>
      ) : (
        <p>Loading...</p>
      )}
      <form className="flex gap-2" onSubmit={sendMessage}>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit" disabled={loading} onClick={sendMessage}>
          Send message
        </Button>
      </form>
    </div>
  );
};

export default Chat;
