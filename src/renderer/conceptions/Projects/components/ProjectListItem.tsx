import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { TProjectListItemProps } from "./types";
import { useDayjs } from "@hooks/dayjs";
import { useParams } from "react-router-dom";

export const ProjectListItem = memo(
  ({ project, onOpen, onEdit, onDelete, divider }: TProjectListItemProps) => {
    const { projectId } = useParams<{ projectId?: string }>();
    const dayjs = useDayjs();
    const memoizedTimeValue = useMemo(() => {
      if (!dayjs) {
        return null;
      }

      return {
        created: dayjs(project.created),
        updated: dayjs(project.updated),
      };
    }, [dayjs, project.created, project.updated]);

    const handleOpen = useCallback(() => {
      onOpen(project);
    }, [onOpen, project]);

    const handleEdit = useCallback(
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

    if (memoizedTimeValue === null) {
      return null;
    }

    const createdLabel = memoizedTimeValue.created.format("MM-DD-YYYY");
    const updatedLabel = memoizedTimeValue.updated.format("MM-DD-YYYY");
    const isActive = projectId === project.id + "";

    return (
      <ListItem
        disablePadding
        alignItems="flex-start"
        divider={divider}
        data-testid={`project-list-item-${project.id}`}
        secondaryAction={
          <Stack direction="row" alignItems="center">
            <Stack direction="column">
              <IconButton
                size="small"
                aria-label="Edit project"
                onClick={handleEdit}
                data-testid={`project-edit-${project.id}`}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Delete project"
                onClick={handleDelete}
                data-testid={`project-delete-${project.id}`}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        }
      >
        <ListItemButton
          onClick={handleOpen}
          sx={{
            pr: 0,

            alignItems: "flex-start",
            transition: (theme) =>
              theme.transitions.create(["background-color", "transform"], {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isActive
              ? {
                  backgroundColor: (theme) => theme.palette.action.hover,
                }
              : {}),
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
          data-testid={`project-list-item-button-${project.id}`}
        >
          <ListItemText
            primary={project.name}
            slotProps={{
              primary: { variant: "subtitle1", fontWeight: 600 },
              secondary: { component: "div" },
            }}
            secondary={
              <Stack spacing={1} direction="row">
                <Stack direction="row" spacing={0.3} alignItems="center">
                  <CalendarTodayRoundedIcon
                    fontSize="inherit"
                    color="primary"
                  />
                  <Typography
                    fontSize={12}
                    component="span"
                    color="text.secondary"
                  >
                    {createdLabel}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.3} alignItems="center">
                  <AccessTimeRoundedIcon fontSize="inherit" color="primary" />
                  <Typography
                    fontSize={12}
                    component="span"
                    color="text.secondary"
                  >
                    {updatedLabel}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.3} alignItems="center">
                  <ChatBubbleOutlineRoundedIcon
                    fontSize="inherit"
                    color="primary"
                  />
                  <Typography
                    fontSize={12}
                    component="span"
                    color="text.secondary"
                  >
                    {project.countTasks}
                  </Typography>
                </Stack>
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  }
);

ProjectListItem.displayName = "ProjectListItem";
