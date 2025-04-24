import { Request, Response, NextFunction } from "express";

const ADMIN_USER_ID = "660929334969761792";

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id: string = (req as any).auth.id;

  if (!id) {
    return res.status(401).json({ error: "Unauthorized: No user ID found" });
  }

  if (id !== ADMIN_USER_ID) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  next();
}
