import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import { matchSorter, rankings } from "match-sorter";
import type { TSearchTasksProps } from "./types";

const SearchTasks = memo(({ items, handlerSearch }: TSearchTasksProps) => {
  const [query, setQuery] = useState("");
  const sourceItemsRef = useRef<TTask[]>(items);
  const hasItems = useRef(false);

  useEffect(() => {
    if (hasItems.current === false && items.length > 0) {
      hasItems.current = true;
      sourceItemsRef.current = items;
    }
  }, [items]);

  const handleSearch = useCallback(
    (value: string) => {
      const normalized = value.trim();

      if (!normalized) {
        handlerSearch(sourceItemsRef.current);
        return;
      }

      const filteredTasks = matchSorter(sourceItemsRef.current, normalized, {
        keys: [(task: TTask) => (task.content ?? []).join(" ")],
        threshold: rankings.CONTAINS,
      });

      handlerSearch(filteredTasks);
    },
    [handlerSearch, items]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setQuery(value);
      handleSearch(value);
    },
    [handleSearch]
  );

  return (
    <TextField
      fullWidth
      placeholder="Search tasks"
      size="small"
      variant="outlined"
      value={query}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 0,
        },
      }}
      onChange={handleChange}
      data-testid="search-tasks"
    />
  );
});

export default SearchTasks;
