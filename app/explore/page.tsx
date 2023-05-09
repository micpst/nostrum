"use client";

import Header from "@/app/components/common/header";
import Post from "@/app/components/post/post";
import { useInfiniteScroll } from "@/app/hooks/useInfiniteScroll";

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
    <div className="w-full max-w-[40rem] border-x">
      <Header title="Explore" />
      <section>
        {posts.map((post) => (
          <Post key={post.id} content={post.content} />
        ))}
        {loading && <div>Loading...</div>}
      </section>
    </div>
  );
}

export default Explore;
