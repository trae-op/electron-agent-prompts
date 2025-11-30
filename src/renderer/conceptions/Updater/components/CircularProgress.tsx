import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { useDownloadedPercentSelector } from "../context/useSelectors";

export const Circular = () => {
  const downloadedPercent = useDownloadedPercentSelector();
  const percent = useMemo(
    () =>
      downloadedPercent === undefined
        ? undefined
        : Math.round(Number(downloadedPercent)),
    [downloadedPercent]
  );

  if (percent === undefined) {
    return null;
  }

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress size={140} variant="determinate" value={percent} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component="h1"
          sx={{ color: "text.secondary" }}
          variant="h4"
        >
          {percent}
        </Typography>
      </Box>
    </Box>
  );
};
