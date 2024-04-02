import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "../layout/mainLayout";
import { ThemeProvider } from "../lib/themeProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </ThemeProvider>
  );
}
