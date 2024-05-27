import { ScrollArea } from "@/components/ui/scroll-area";
import { getMessages } from "@/supabase/lib/projectLogic";
import NextCrypto from "next-crypto";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import Message from "../../components/projectCompo/message";
import { supabase } from "../../supabase/supabase";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

interface MessageData {
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
  const crypto = new NextCrypto(
    process.env.NEXT_PUBLIC_CRYPTO_SECRET as string
  );
  const router = useRouter();
  const { data: messages, error } = useSWR(project_id, () =>
    getMessages(project_id)
  );

  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [decryptedMessages, setDecryptedMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    if (messages) {
      const decryptMessages = async () => {
        const decrypted = await Promise.all(
          messages.map(async (message: MessageData) => ({
            ...message,
            content: (await crypto.decrypt(message.content)) || "",
          }))
        );
        setDecryptedMessages(decrypted);
      };
      decryptMessages();
    }
  }, [messages, crypto]);

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

    if (!message) {
      setLoading(false);
      toast({
        title: "error",
        description: "Message cannot be empty",
      });
      return;
    } else if (message.length > 1000) {
      toast({
        title: "error",
        description: "Message cannot be longer than 1000 characters",
      });
      setLoading(false);
      return;
    } else if (message.length < 1) {
      toast({
        title: "error",
        description: "Message cannot be empty",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("messages").insert([
      {
        project_id: project_id,
        sender: userAuthId,
        content: await crypto.encrypt(message),
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
      {decryptedMessages.length > 0 ? (
        <ScrollArea className="h-[700px]">
          <div className="flex flex-col gap-1">
            {decryptedMessages.map((message: MessageData) => (
              <Message
                key={message.id}
                name={message.sender === userAuthId ? "You" : message.sender}
                authId={message.sender}
                message={message.content}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p>Loading...</p>
      )}
      <form
        className="flex flex-col gap-2 md:flex-row w-full"
        onSubmit={sendMessage}
      >
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
