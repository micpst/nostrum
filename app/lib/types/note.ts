import { ImagesPreview } from "@/app/lib/types/file";

export type Note = {
  id: string;
  text?: string;
  images?: ImagesPreview;
  parent?: { id: string; username: string };
  userLikes: string[];
  createdBy: string;
  createdAt: number;
  userReplies: number;
  userReposts: string[];
};
