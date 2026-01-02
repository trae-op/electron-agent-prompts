import {
  useCallback,
  memo,
  type ChangeEvent,
  type FormEvent,
  useRef,
} from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ClearIcon from "@mui/icons-material/Clear";

import {
  useSearchResultSelector,
  useSetSearchResultDispatch,
  useSetSearchQueryDispatch,
  useSearchQuerySelector,
} from "../context";

const ArrowButtons = () => {
  const { matches, activeMatchOrdinal } = useSearchResultSelector();
  const searchQuery = useSearchQuerySelector();
  const isEmpty = searchQuery.trim() === "" || matches === 0;

  const handleNext = useCallback(() => {
    window.electron.send.findInPage({
      text: searchQuery,
      options: {
        findNext: true,
        forward: true,
      },
    });
  }, [searchQuery]);

  const handlePrev = useCallback(() => {
    window.electron.send.findInPage({
      text: searchQuery,
      options: {
        findNext: true,
        forward: false,
      },
    });
  }, [searchQuery]);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Typography variant="caption" color="text.secondary">
        found {activeMatchOrdinal} of {matches}
      </Typography>
      <IconButton
        aria-label="previous match"
        size="small"
        onClick={handlePrev}
        disabled={isEmpty || activeMatchOrdinal === 2}
        data-testid="search-content-previous"
      >
        <ArrowUpwardIcon fontSize="small" />
      </IconButton>
      <IconButton
        aria-label="next match"
        size="small"
        onClick={handleNext}
        disabled={isEmpty || activeMatchOrdinal === matches}
        data-testid="search-content-next"
      >
        <ArrowDownwardIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
};

const EndAdornment = memo(
  ({ inputRef }: { inputRef: React.RefObject<HTMLInputElement | null> }) => {
    const searchQuery = useSearchQuerySelector();
    const setSearchQuery = useSetSearchQueryDispatch();
    const resetSearch = useSetSearchResultDispatch();

    const handleClear = useCallback(() => {
      setSearchQuery("");
      resetSearch({ activeMatchOrdinal: 0, matches: 0 });
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
      window.electron.send.stopFindInPage();
    }, []);

    if (searchQuery.trim() === "") {
      return null;
    }

    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="clear search"
          size="small"
          onClick={handleClear}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </InputAdornment>
    );
  }
);

export const SearchContent = () => {
  const setSearchQuery = useSetSearchQueryDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const input = form.elements.namedItem("search-input") as HTMLInputElement;
    const text = input.value;

    if (text.trim() === "") {
      window.electron.send.stopFindInPage();
      return;
    }

    window.electron.send.findInPage({
      text,
    });
  }, []);

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      direction="row"
      spacing={1}
      alignItems="center"
      width="100%"
    >
      <TextField
        size="small"
        fullWidth
        inputRef={inputRef}
        sx={{ flex: 1 }}
        name="search-input"
        placeholder="Find in page + ↵"
        data-testid="search-content-input-field"
        onChange={handleChange}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: <EndAdornment inputRef={inputRef} />,
          },
        }}
      />

      <ArrowButtons />
    </Stack>
  );
};
