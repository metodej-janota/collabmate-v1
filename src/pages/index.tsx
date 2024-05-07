import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getUseSessionInfo } from "../supabase/lib/authLogic";
import { supabase } from "../supabase/supabase";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("test_table").select("*");

        if (error) {
          throw error;
        }

        const userData = await getUseSessionInfo();
        setUser(userData);
        console.log(userData[0]);

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
        {user.map((item, index) => (
          <div key={index}>
            <p>{item.email}</p>
            <p>{item.id}</p>
          </div>
        ))}
      </div>
    </>
  );
}
