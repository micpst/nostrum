import TextArea from "react-textarea-autosize";
import type { ReactNode, RefObject, ChangeEvent } from "react";

type InputFormProps = {
  children?: ReactNode;
  inputRef: RefObject<HTMLTextAreaElement>;
  inputValue: string;

  handleChange: ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => void;
};

function InputForm({
  children,
  inputRef,
  inputValue,

  handleChange,
}: InputFormProps): JSX.Element {
  return (
    <div className="flex min-h-[48px] w-full flex-col justify-center gap-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <TextArea
            className="w-full min-w-0 resize-none bg-transparent text-xl outline-none
                       placeholder:text-light-secondary"
            value={inputValue}
            placeholder="What's happening?"
            minRows={3}
            maxRows={15}
            onChange={handleChange}
            ref={inputRef}
          />
        </div>
      </div>
      {children}
    </div>
  );
}

export default InputForm;
