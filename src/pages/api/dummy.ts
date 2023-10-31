import type { NextApiRequest, NextApiResponse } from "next";
import type { BackendResponse } from "@/types/backendResponse";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const response: BackendResponse = { message: new Date().toISOString() };
  res.status(200).json(response);
};

export default handler;
