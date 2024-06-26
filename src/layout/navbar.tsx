import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CircleUser,
  LayoutDashboard,
  Menu,
  Moon,
  Package2,
  Plus,
  Search,
  Settings,
  Sun,
  Users2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { logOut } from "../supabase/lib/authLogic";
import { supabase } from "../supabase/supabase";

export function Navbar() {
  const { setTheme } = useTheme();
  const router = useRouter();

  const [logined, setLogined] = useState(false);
  supabase.auth.onAuthStateChange((_, session) => {
    if (session == undefined) {
      setLogined(false);
    } else {
      setLogined(true);
    }
  });

  return (
    <>
      {logined ? (
        <div className="flex fixed w-full flex-col z-50">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            {logined ? (
              <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/dashboard/projects"
                          className={`${
                            router.pathname === "/dashboard/projects"
                              ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          }`}
                        >
                          <LayoutDashboard
                            className={`${
                              router.pathname === "/dashboard/projects"
                                ? "h-4 w-4 transition-all group-hover:scale-110"
                                : "h-5 w-5"
                            }`}
                          />
                          <span className="sr-only">Projects</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Projects</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/dashboard/createProject"
                          className={`${
                            router.pathname === "/dashboard/createProject"
                              ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          }`}
                        >
                          <Plus
                            className={`${
                              router.pathname === "/dashboard/createProject"
                                ? "h-4 w-4 transition-all group-hover:scale-110"
                                : "h-5 w-5"
                            }`}
                          />
                          <span className="sr-only">Create new project</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Create new project
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/dashboard/friendships"
                          className={`${
                            router.pathname === "/dashboard/friendships"
                              ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          }`}
                        >
                          <Users2
                            className={`${
                              router.pathname === "/dashboard/friendships"
                                ? "h-4 w-4 transition-all group-hover:scale-110"
                                : "h-5 w-5"
                            }`}
                          />
                          <span className="sr-only">Friendships</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Friendships</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/dashboard/user/settings"
                          className={`${
                            router.pathname === "/dashboard/user/settings"
                              ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                              : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                          }`}
                        >
                          <Settings
                            className={`${
                              router.pathname === "/dashboard/user/settings"
                                ? "h-4 w-4 transition-all group-hover:scale-110"
                                : "h-5 w-5"
                            }`}
                          />
                          <span className="sr-only">Settings</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </nav>
              </aside>
            ) : null}
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="/"
                className="text-foreground transition-colors hover:text-foreground text-lg font-semibold md:text-base"
              >
                CollabMate
              </Link>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link href="/dashboard/projects" className="text-2xl">
                    CollabMate
                  </Link>
                  <Link
                    href="/dashboard/projects"
                    className={`${
                      router.pathname === "/dashboard/projects"
                        ? "hover:text-foreground text-orange-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/createProject"
                    className={`${
                      router.pathname === "/dashboard/createProject"
                        ? "hover:text-foreground text-orange-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create new project
                  </Link>
                  <Link
                    href="/dashboard/friendships"
                    className={`${
                      router.pathname === "/dashboard/friendships"
                        ? "hover:text-foreground text-orange-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Friendships
                  </Link>
                  <Link
                    href="/dashboard/user/settings"
                    className={`${
                      router.pathname === "/dashboard/user/settings"
                        ? "hover:text-foreground text-orange-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-1 sm:flex-initial"></form>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/dashboard/user/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </div>
      ) : (
        <div className="flex fixed w-full flex-col">
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
              <p className="text-foreground transition-colors hover:text-foreground">
                CollabMate
              </p>
            </nav>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                  <p className="text-foreground transition-colors hover:text-foreground">
                    CollabMate
                  </p>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-initial">
                <div className="relative flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="secondary">
                    <Link href="/register">Registrovat</Link>
                  </Button>
                  <Button>
                    <Link href="/login">Přihlásit se</Link>
                  </Button>
                </div>
              </form>
            </div>
          </header>
        </div>
      )}
    </>
  );
}
