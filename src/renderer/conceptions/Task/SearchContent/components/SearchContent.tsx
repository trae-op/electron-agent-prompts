import {
  useCallback,
  memo,
  useState,
  type ChangeEvent,
  type FormEvent,
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
} from "../context";

const ArrowButtons = memo(({ searchQuery }: { searchQuery: string }) => {
  const { matches, activeMatchOrdinal } = useSearchResultSelector();
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
});

export const SearchContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const resetSearch = useSetSearchResultDispatch();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (searchQuery.trim() === "") {
        window.electron.send.stopFindInPage();
        return;
      }

      window.electron.send.findInPage({
        text: searchQuery,
      });
    },
    [searchQuery]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    resetSearch({ activeMatchOrdinal: 0, matches: 0 });
    window.electron.send.stopFindInPage();
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
        value={searchQuery}
        fullWidth
        sx={{ flex: 1 }}
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
            endAdornment:
              searchQuery.trim() !== "" ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    size="small"
                    onClick={handleClear}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
          },
        }}
      />

      <ArrowButtons searchQuery={searchQuery} />
    </Stack>
  );
};
