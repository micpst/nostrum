import { useState, useEffect } from "react";
import type { Event, Filter } from "nostr-tools";
import { useEvents } from "@/app/lib/hooks/useEvents";

type InfiniteScroll = {
  posts: Event[];
  loading: boolean;
};

type InfiniteScrollOption = {
  initialSize?: number;
  stepSize?: number;
};

export function useInfiniteScroll(
  filter: Filter,
  options?: InfiniteScrollOption
): InfiniteScroll {
  const { initialSize = 10, stepSize = 10 } = options ?? {};

  const [posts, setPosts] = useState<Event[]>([]);
  const [postsTotal, setPostsTotal] = useState<number>(initialSize);
  const [postsLimit, setPostsLimit] = useState<number>(initialSize);
  const [postsUntil, setPostsUntil] = useState<number | undefined>(undefined);

  const { events, loading } = useEvents({
    ...filter,
    limit: postsLimit,
    until: postsUntil,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.innerHeight + document.documentElement.scrollTop;
      if (Math.ceil(scrollTop) !== document.documentElement.offsetHeight)
        return;
      setPostsTotal((prev: number) => prev + stepSize);
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const lastEvent = posts.slice(-1)[0];
      setPostsUntil(lastEvent.created_at);
      setPostsLimit(stepSize);
    }
  }, [postsTotal]);

  useEffect(() => {
    if (!events) return;
    setPosts((prev) => [...prev, ...events]);
  }, [events]);

  return { posts, loading };
}
