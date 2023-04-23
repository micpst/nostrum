export type PostProps = {
  content: string;
};

function Post({ content }: PostProps) {
  return <div className="break-words">{content}</div>;
}

export default Post;
