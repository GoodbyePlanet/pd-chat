import { ReactElement, ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const Layout = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center ${inter.className}`}>
      {children}
    </main>
  );
};
