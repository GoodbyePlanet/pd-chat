import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "@/database/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { question } = req.body;

  try {
    const { error } = await supabaseClient.from("questions").insert({ question });

    if (error) {
      console.error("Error saving entry:", error);
      res.status(500).json("Error occurred while saving wrong answer!");
    }

    res.status(200).json("Successfully saved wrong answer!");
  } catch (error) {
    res.status(500).json("Something went wrong!");
    console.error("Error saving entry:", error);
  }
}
