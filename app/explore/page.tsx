"use client";

import Header from "@/app/components/common/header";
import Post from "@/app/components/post/post";
import { useInfiniteScroll } from "@/app/lib/hooks/useInfiniteScroll";

function Explore() {
  const filter = {
    kinds: [1],
  };
  const options = {
    initialSize: 50,
    stepSize: 30,
  };

  const { posts, loading } = useInfiniteScroll(filter, options);

  console.log(posts);

  return (
    <div className="w-full max-w-[40rem] border-x">
      <Header title="Explore" />
      <section>
        {posts.map((post) => (
          <Post key={post.id} event={post} />
        ))}
        {loading && <div>Loading...</div>}
      </section>
    </div>
  );
}

export default Explore;
