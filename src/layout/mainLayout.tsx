import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "./navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
