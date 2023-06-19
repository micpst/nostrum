import { ImagesPreview } from "@/app/lib/types/file";

export type Note = {
  id: string;
  text?: string;
  images?: ImagesPreview;
  parent?: { id: string; username: string };
  createdBy: string;
  createdAt: number;
  userLikes: string[];
  userReplies: number;
  userReposts: string[];
};
