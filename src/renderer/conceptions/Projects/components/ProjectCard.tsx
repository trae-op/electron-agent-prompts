import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
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
import type {
  TProjectCardDetailsProps,
  TProjectCardFooterProps,
  TProjectCardMetaRowProps,
  TProjectCardProps,
} from "./types";

const ProjectCardMetaRow = memo(({ icon, label }: TProjectCardMetaRowProps) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
});

ProjectCardMetaRow.displayName = "ProjectCardMetaRow";

const ProjectCardDetails = memo(
  ({
    project,
    createdLabel,
    updatedLabel,
    onOpen,
  }: TProjectCardDetailsProps) => {
    const handleOpen = useCallback(() => onOpen(project), [onOpen, project]);

    return (
      <CardActionArea
        onClick={handleOpen}
        sx={{
          flexGrow: 1,
          alignSelf: "stretch",
          borderEndEndRadius: 3,
          borderEndStartRadius: 3,
        }}
        data-testid={`project-card-area-${project.id}`}
      >
        <CardContent sx={{ px: 3, py: 3 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              {project.name}
            </Typography>
            <Stack spacing={1.5}>
              <ProjectCardMetaRow
                icon={
                  <CalendarTodayRoundedIcon fontSize="small" color="primary" />
                }
                label={`Created: ${createdLabel}`}
              />
              <ProjectCardMetaRow
                icon={
                  <AccessTimeRoundedIcon fontSize="small" color="primary" />
                }
                label={`Updated: ${updatedLabel}`}
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    );
  }
);

ProjectCardDetails.displayName = "ProjectCardDetails";

const ProjectCardFooter = memo(
  ({ project, promptsCount, onEdit, onDelete }: TProjectCardFooterProps) => {
    const handlerEdit = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onEdit(project);
      },
      [onEdit, project]
    );

    const handleDelete = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onDelete(project);
      },
      [onDelete, project]
    );

    const promptsLabel = useMemo(() => {
      const pluralSuffix = promptsCount === 1 ? "" : "s";
      return `${promptsCount} Prompt${pluralSuffix}`;
    }, [promptsCount]);

    return (
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
            {promptsLabel}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              aria-label="Edit project"
              onClick={handlerEdit}
              data-testid={`project-edit-${project.id}`}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              aria-label="Delete project"
              onClick={handleDelete}
              data-testid={`project-delete-${project.id}`}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    );
  }
);

ProjectCardFooter.displayName = "ProjectCardFooter";

export const ProjectCard = memo(
  ({ item, onOpen, onEdit, onDelete }: TProjectCardProps) => {
    const { project, createdLabel, updatedLabel, promptsCount } = item;

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
        <ProjectCardDetails
          project={project}
          createdLabel={createdLabel}
          updatedLabel={updatedLabel}
          onOpen={onOpen}
        />
        <ProjectCardFooter
          project={project}
          promptsCount={promptsCount}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";
