"use client";

type ErrorProps = {
  message?: string;
};

function Error({ message }: ErrorProps): JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center
                 gap-2 py-5 px-3 text-light-secondary dark:text-dark-secondary"
    >
      <p>{message ?? "Something went wrong. Try reloading."}</p>
    </div>
  );
}

export default Error;
