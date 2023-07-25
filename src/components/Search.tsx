import { useSetAtom } from "jotai";
import { ChangeEvent, useCallback } from "react";

import { queryAtom } from "../store/store";

import { debounce } from "./utils";

export const Search = () => {
  const setQuery = useSetAtom(queryAtom);

  const debounced = debounce((value: string) => {
    setQuery(value);
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
