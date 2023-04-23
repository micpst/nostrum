"use client";

import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";
import Post from "@/app/components/post/post";

function Explore() {
  const filter = {
    kinds: [1],
  };
  const options = {
    initialSize: 50,
    stepSize: 30,
  };

  const { posts, loading } = useInfiniteScroll(filter, options);

  return (
    <div className="min-h-screen w-full max-w-2xl border-r">
      <div className="flex py-4 px-3 sticky top-0 z-50 backdrop-blur-md bg-white bg-opacity-75 border-b">
        <h2 className="text-lg sm:text-xl font-bold">Explore</h2>
      </div>
      {posts.map((post) => (
        <Post key={post.id} content={post.content} />
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default Explore;
