import express from "express"

export const getStatus = (req: express.Request, res: express.Response) => {
  res.json({ status: "API is working" });
};

