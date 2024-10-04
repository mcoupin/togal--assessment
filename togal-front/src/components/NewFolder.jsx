import React, { useState } from "react";
import Grid from "@mui/material/Grid2";
import FolderIcon from "@mui/icons-material/Folder";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

const NewFolder = () => {
  const queryClient = useQueryClient();
  const createNewFolder = useMutation({
    mutationFn: async (name) => {
      const response = await fetch("http://localhost:3000/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries("folders");
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleAddClick = () => {
    setIsAdding(true); // Show input field when the user clicks "Add New Folder"
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      createNewFolder.mutate(folderName); // Trigger the onAdd function and pass the folder name
      setFolderName(""); // Reset folder name
      setIsAdding(false); // Hide input field after adding
    }
  };

  const handleCancel = () => {
    setIsAdding(false); // Hide input field without creating folder
    setFolderName(""); // Clear input field
  };

  return (
    <Grid size={{ xs: 12 }} paddingTop={"20px"}>
      <Box
        display="flex"
        alignItems="center"
        padding="10px"
        borderRadius="8px"
        boxShadow={1}
        onClick={() => {
          if (!isAdding) handleAddClick();
        }}
        sx={{
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
      >
        {!isAdding ? (
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="center">
              <FolderIcon
                sx={{ fontSize: 40, marginRight: 2, color: "#3f51b5" }}
              />
              <AddIcon
                sx={{
                  fontSize: 20,
                  color: "#3f51b5",
                  position: "relative",
                  left: "-20px", // Position "+" over folder icon
                  top: "-10px",
                }}
              />
            </Box>
            <Typography variant="h6" color="textPrimary">
              Add New Folder
            </Typography>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" width="100%">
            <TextField
              label="Folder Name"
              variant="outlined"
              size="small"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
              sx={{ marginRight: 2, flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateFolder}
              sx={{ marginRight: 1 }}
            >
              Create
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default NewFolder;
