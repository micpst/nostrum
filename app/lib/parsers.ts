const topDomains = [
  /\.com/,
  /\.de/,
  /\.org/,
  /\.net/,
  /\.us/,
  /\.co/,
  /\.edu/,
  /\.gov/,
  /\.biz/,
  /\.za/,
  /\.info/,
  /\.social/,
  /\.cc/,
  /\.ca/,
  /\.cn/,
  /\.fr/,
  /\.ch/,
  /\.au/,
  /\.in/,
  /\.jp/,
  /\.pl/,
  /\.io/,
  /\.be/,
  /\.it/,
  /\.nl/,
  /\.uk/,
  /\.mx/,
  /\.no/,
  /\.ru/,
  /\.br/,
  /\.se/,
  /\.es/,
  /\.at/,
  /\.dk/,
  /\.eu/,
  /\.il/,
] as const;

const imageRegex = new RegExp(
  /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?\S*)?.(jpg|jpeg|png|gif|svg|webp)/g
);

const linkRegex = new RegExp(
  /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?\S*)?/g
);

const tagRegex = new RegExp(/#\w+/g);

export const parseImages = (text: string): string[] => {
  return text.match(imageRegex) ?? [];
};

export const parseLinks = (text: string): string[] => {
  const matches = text.match(linkRegex);
  if (!matches) return [];

  return matches.filter((match) =>
    topDomains.some((domain) => match.match(domain))
  );
};

export const parseTags = (text: string): string[] => {
  return text.match(tagRegex) ?? [];
};
