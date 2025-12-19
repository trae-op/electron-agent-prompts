import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

export const ApplyButton = () => {
  const openModal = () => {
    // Logic to open modal goes here
    console.log("Open modal");
  };

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={openModal}
      data-testid="apply-button"
    >
      Apply
    </Button>
  );
};

ApplyButton.displayName = "ApplyButton";
