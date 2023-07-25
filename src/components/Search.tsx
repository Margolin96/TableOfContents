import { ChangeEvent, useCallback } from "react";

import { debounce } from "./utils";

interface SearchProps {
  onChange: (value: string) => void;
}

export const Search = ({ onChange}: SearchProps) => {
  const debounced = debounce((value: string) => {
    onChange(value);
  }, 500);
  
  const changeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    debounced(event.target.value);
  }, [debounced]);

  return (
    <input
      className="w-full px-8 border-1 border-x-0 border-neutral-200"
      placeholder="Search..."
      style={{ boxShadow: 'none' }}
      type="search"
      onChange={changeHandler}
    />
  );
}
