import { ReactElement } from "react";
import { signIn } from "next-auth/react";

export const SignIn = (): ReactElement => (
  <div className="flex flex-row items-center justify-center">
    <div className="flex flex-col">
      <h1 className="mb-4 font-medium">Please use your ProductDock google account to sign in.</h1>
      <div className="max-w-sm px-6 text-center sm:px-0">
        <button
          type="button"
          onClick={() => signIn("google")}
          className="mb-2 mr-2 inline-flex  items-center rounded-lg border  border-b-pd
         px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#4285F4]/50"
        >
          <svg
            className="-ml-1 mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Sign up with Google
        </button>
      </div>
    </div>
  </div>
);
