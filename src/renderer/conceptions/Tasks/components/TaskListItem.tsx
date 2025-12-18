import { memo, useCallback, useMemo } from "react";
import type { MouseEvent } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import type { TTaskListItemProps } from "./types";
import { useDayjs } from "@hooks/dayjs";

export const TaskListItem = memo(
  ({ task, onOpen, onEdit, onDelete, divider }: TTaskListItemProps) => {
    const dayjs = useDayjs();

    const memoizedTimeValue = useMemo(() => {
      if (!dayjs) {
        return null;
      }

      return {
        created: dayjs(task.created),
        updated: dayjs(task.updated),
      };
    }, [dayjs, task.created, task.updated]);

    const handleOpen = useCallback(() => {
      onOpen(task);
    }, [onOpen, task]);

    const handleEdit = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onEdit(task);
      },
      [onEdit, task]
    );

    const handleDelete = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onDelete(task);
      },
      [onDelete, task]
    );

    if (memoizedTimeValue === null) {
      return null;
    }

    const createdLabel = memoizedTimeValue.created.format("MM-DD-YYYY");
    const updatedLabel = memoizedTimeValue.updated.format("MM-DD-YYYY");

    return (
      <ListItem
        disablePadding
        alignItems="flex-start"
        divider={divider}
        data-testid={`task-list-item-${task.id}`}
        secondaryAction={
          <Stack direction="row" alignItems="center">
            <Stack direction="column">
              <IconButton
                size="small"
                aria-label="Edit task"
                onClick={handleEdit}
                data-testid={`task-edit-${task.id}`}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Delete task"
                onClick={handleDelete}
                data-testid={`task-delete-${task.id}`}
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
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
          data-testid={`task-list-item-button-${task.id}`}
        >
          <ListItemText
            primary={task.name}
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
                    {task.projectId}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={0.3} alignItems="center">
                  <EditDocumentIcon
                    fontSize="inherit"
                    color={Boolean(task.fileId) ? "success" : "error"}
                  />
                </Stack>
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
    );
  }
);

TaskListItem.displayName = "TaskListItem";
