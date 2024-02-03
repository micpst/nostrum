const imageUrlRegex = new RegExp(/\.(jpg|jpeg|png|gif|svg|webp)/);
const videoUrlRegex = new RegExp(/\.(mp4|webm|ogg|mov)|youtube\.com|youtu\.be/);

export const validateImageUrl = (url: string): boolean => {
  return imageUrlRegex.test(url);
};

export const validateVideoUrl = (url: string): boolean => {
  return videoUrlRegex.test(url);
};
