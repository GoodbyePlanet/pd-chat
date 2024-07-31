import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { useSession } from "next-auth/react";
import PDChat from "@/components/PDChat";
import { SignIn } from "@/components/SignIn";
import Header from "@/components/Header";
import { Layout } from "@/components/Layout";

import styles from "../components/Loader.module.css";

const queryClient = new QueryClient();

export default function App() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Layout>
        <span className={styles.loader}></span>
      </Layout>
    );
  }

  if (status === "authenticated") {
    return (
      <RecoilRoot>
        <Header />
        <Layout>
          <QueryClientProvider client={queryClient}>
            <PDChat />
          </QueryClientProvider>
        </Layout>
      </RecoilRoot>
    );
  }

  return (
    <Layout>
      <SignIn />
    </Layout>
  );
}
