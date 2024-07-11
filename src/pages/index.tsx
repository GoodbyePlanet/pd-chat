import { QueryClient, QueryClientProvider } from "react-query";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import PDChat from "@/components/PDChat";
import { SignIn } from "@/components/SignIn";

import styles from "../components/Loader.module.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return <span className={styles.loader}></span>;
  }

  if (status === "authenticated") {
    return (
      <QueryClientProvider client={queryClient}>
        <PDChat />
      </QueryClientProvider>
    );
  }

  return <SignIn />;
}

export default function App() {
  return (
    <div>
      <Header />
      <main className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}>
        <Home />
      </main>
    </div>
  );
}
