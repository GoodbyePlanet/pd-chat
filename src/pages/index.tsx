import { QueryClient, QueryClientProvider } from "react-query";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import PDChat from "@/components/PDChat";
import { SignIn } from "@/components/SignIn";

import styles from "../components/Loader.module.css";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

function App() {
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

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}>
      <App />
    </main>
  );
}
