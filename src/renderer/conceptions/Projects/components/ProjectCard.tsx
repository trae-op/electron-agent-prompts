import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { TProjectCardProps } from "./types";

export const ProjectCard = ({
  item,
  onOpen,
  onEdit,
  onDelete,
}: TProjectCardProps) => {
  const { project, createdLabel, updatedLabel, promptsCount } = item;
  const pluralSuffix = promptsCount === 1 ? "" : "s";

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.grey[800]
            : theme.palette.grey[200],
        boxShadow: (theme) => theme.shadows[1],
        transition: (theme) =>
          theme.transitions.create(["transform", "box-shadow"], {
            duration: theme.transitions.duration.shorter,
          }),
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
      data-testid={`project-card-${project.id}`}
    >
      <CardActionArea
        onClick={() => onOpen(project)}
        sx={{ flexGrow: 1, alignSelf: "stretch" }}
        data-testid={`project-card-area-${project.id}`}
      >
        <CardContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              {project.name}
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayRoundedIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Created: {createdLabel}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeRoundedIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Updated: {updatedLabel}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: (theme) =>
            `1px solid ${
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[200]
            }`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ChatBubbleOutlineRoundedIcon fontSize="small" color="primary" />
          <Typography variant="body2" color="text.secondary">
            {promptsCount} Prompt{pluralSuffix}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              aria-label="Edit project"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(project);
              }}
              data-testid={`project-edit-${project.id}`}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              aria-label="Delete project"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(project);
              }}
              data-testid={`project-delete-${project.id}`}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
};
