import { ReactElement } from "react";
import { signOut } from "next-auth/react";

export const Logout = (): ReactElement => (
  <div className="absolute right-2 top-2 hidden md:block">
    <button
      onClick={() => signOut()}
      className="border-gray-400 rounded border bg-white px-4 py-2 font-semibold text-pd shadow"
    >
      <div className="flex items-center">
        <svg
          className="text-red-500 h-5 w-5"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
          <path d="M7 12h14l-3 -3m0 6l3 -3" />
        </svg>
        <span className="pl-2">Logout</span>
      </div>
    </button>
  </div>
);
