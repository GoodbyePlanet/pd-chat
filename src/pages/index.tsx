import { QueryClient, QueryClientProvider } from "react-query";
import { Inter } from "next/font/google";
import PDChat from "@/components/PDChat";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PDChat />
    </QueryClientProvider>
  );
}

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}
    >
      <App />
    </main>
  );
}
