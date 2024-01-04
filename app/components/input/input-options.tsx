import { motion } from "framer-motion";
import { variants } from "./input";
import Button from "@/app/components/ui/button";

type InputOptionsProps = {
  modal?: boolean;
  reply?: boolean;
  inputLength: number;
  isValidTweet: boolean;
};

function InputOptions({
  modal,
  reply,
  inputLength,
  isValidTweet,
}: InputOptionsProps): JSX.Element {
  return (
    <motion.div className="flex justify-between" {...variants}>
      <div
        className="flex text-main-accent xs:[&>button:nth-child(n+6)]:hidden
                   md:[&>button]:!block [&>button:nth-child(n+4)]:hidden"
      ></div>
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-4"
          animate={
            inputLength ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
        >
          <i className="hidden h-8 w-[1px] bg-[#B9CAD3] dark:bg-[#3E4144] xs:block" />
        </motion.div>
        <Button
          type="submit"
          className="accent-tab bg-main-accent px-4 py-1.5 font-bold text-white
                     enabled:hover:bg-main-accent/90
                     enabled:active:bg-main-accent/75"
          disabled={!isValidTweet}
        >
          {reply ? "Reply" : "Publish"}
        </Button>
      </div>
    </motion.div>
  );
}

export default InputOptions;
