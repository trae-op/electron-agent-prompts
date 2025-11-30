import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {
  useUserSelector,
  useRenderButtonLogoutSelector,
  useRenderButtonUpdateSelector,
} from "../context/useSelectors";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export const Content = () => {
  const user = useUserSelector();
  const renderButtonLogout = useRenderButtonLogoutSelector();
  const renderButtonUpdateApp = useRenderButtonUpdateSelector();

  if (user === undefined) {
    return null;
  }

  return (
    <Box sx={{ width: 200 }}>
      <Stack sx={{ mt: 2, mb: 2 }} spacing={1} alignItems="center">
        <Avatar
          sx={{ width: 80, height: 80 }}
          alt="profile"
          src={user.picture || ""}
        />
        {user.displayName !== undefined && (
          <Typography variant="body2" color="text.secondary">
            {user.displayName}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
      </Stack>
      <Divider />

      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>{renderButtonUpdateApp}</ListItem>
          <ListItem disablePadding>{renderButtonLogout}</ListItem>
        </List>
      </nav>
    </Box>
  );
};
