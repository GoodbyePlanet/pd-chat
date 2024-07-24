import { Models } from "@/types";

export const getKeyByValue = (value: string): string | undefined => {
  const entries = Object.entries(Models) as [keyof typeof Models, string][];
  for (const [key, enumValue] of entries) {
    if (enumValue === value) {
      return key;
    }
  }
  return undefined;
};
