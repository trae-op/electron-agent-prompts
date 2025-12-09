import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";

import { useControl } from "../hooks/useControl";
import { useUserSelector } from "../context/useSelectors";
import { useIpc } from "../hooks";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { TUserPopoverProps } from "./types";
import { memo } from "react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#f00",
    color: "#f00",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserAvatar = memo((props: { width?: number; height?: number }) => {
  const user = useUserSelector();

  if (
    user === undefined ||
    (user !== undefined && user.picture === undefined)
  ) {
    return null;
  }

  return <Avatar sx={props} alt="profile" src={user.picture} />;
});

const DisplayName = () => {
  const user = useUserSelector();

  if (user?.displayName === undefined) {
    return null;
  }

  return (
    <Typography variant="body2" color="text.secondary">
      {user.displayName}
    </Typography>
  );
};

const DisplayEmail = () => {
  const user = useUserSelector();

  if (user?.email === undefined) {
    return null;
  }

  return (
    <Typography variant="body2" color="text.secondary">
      {user.email}
    </Typography>
  );
};

export const UserPopover = ({ nav, isNewVersionApp }: TUserPopoverProps) => {
  useIpc();
  const { handleClick, handleClose, id, isOpen, anchorEl } = useControl();

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-describedby={id}
        aria-label="delete"
      >
        <StyledBadge
          overlap="circular"
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          variant={isNewVersionApp ? "dot" : "standard"}
        >
          <UserAvatar width={28} height={28} />
        </StyledBadge>
      </IconButton>

      <Popover
        id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ width: 200 }}>
          <Stack sx={{ mt: 2, mb: 2 }} spacing={1} alignItems="center">
            <UserAvatar width={80} height={80} />
            <DisplayName />
            <DisplayEmail />
          </Stack>
          <Divider />

          <nav aria-label="secondary mailbox folders">{nav}</nav>
        </Box>
      </Popover>
    </>
  );
};
