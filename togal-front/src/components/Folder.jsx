import React from "react";
import Grid from "@mui/material/Grid2";
import FolderIcon from "@mui/icons-material/Folder";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
const Folder = ({ folder }) => {
  const navigate = useNavigate();
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Box
        display="flex"
        alignItems="center"
        padding="10px"
        borderRadius="8px"
        boxShadow={1}
        minHeight="80px"
        sx={{
          cursor: "pointer",
          backgroundColor: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        }}
        onClick={() => {
          navigate(`/folder/${folder.id}`);
        }}
      >
        <FolderIcon sx={{ fontSize: 40, marginRight: 2, color: "#3f51b5" }} />
        <Typography variant="h6" color="textPrimary">
          {folder.name}
        </Typography>
      </Box>
    </Grid>
  );
};

export default Folder;
