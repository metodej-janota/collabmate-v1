import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getUseSessionInfo } from "../supabase/lib/authLogic";
import { supabase } from "../supabase/supabase";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState({} as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("test_table").select("*");

        if (error) {
          throw error;
        }

        const userData = await getUseSessionInfo();
        setUser(userData);
        console.log(userData);

        setData(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  supabase.auth.onAuthStateChange((_, session) => {
    if (session) {
      console.log("GitHub login successful");
    } else {
      console.log("logged out");
    }
  });

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="m-auto text-center gap-4">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-7xl">
            CollabMate
          </h1>
          <p className="text-xl text-muted-foreground">
            A modal dialog that interrupts the user with important content and
            expects a response.
          </p>
          <div className="flex gap-4 mt-6">
            <Button className="w-[100%]">Sign in</Button>
            <Button className="w-[100%]">Sign up</Button>
          </div>
        </div>
      </div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            {item.name} - {item.age}
          </li>
        ))}
      </ul>
      <div>
        <br />
        <br />
        <p>user info</p>
        <p>{user?.email}</p>
        <p>{user?.id}</p>
        <p>{user?.aud}</p>
        <p>{user?.app_metadata?.provider}</p>
        <p>{user?.user_metadata?.full_name}</p>
        <Image
          src={user?.user_metadata?.avatar_url}
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
    </>
  );
}
