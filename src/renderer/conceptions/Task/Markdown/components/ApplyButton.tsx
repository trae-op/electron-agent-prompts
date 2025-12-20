import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

export const ApplyButton = () => {
  const handleSave = () => {
    // Logic to open modal goes here
    console.log("Save Button");
  };

  return (
    <Button
      variant="contained"
      startIcon={<SaveIcon />}
      onClick={handleSave}
      data-testid="apply-button"
    >
      Save
    </Button>
  );
};

ApplyButton.displayName = "ApplyButton";
