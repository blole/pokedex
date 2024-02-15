import { parseSearchString } from "@/search/searchStringParser";
import React, { ChangeEvent, KeyboardEvent, useCallback } from "react";

export type SearchProps = {
  value: string;
  setValue: (value: string) => void;
  onSubmit: (value: string) => void;
  className?: string;
};

export const Search = ({
  value,
  setValue,
  onSubmit,
  className,
}: SearchProps) => {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target?.value);
    },
    [setValue],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSubmit(event.currentTarget.value);
      }
    },
    [onSubmit],
  );

  return (
    <input
      type="search"
      placeholder="Search"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={className}
    />
  );
};
