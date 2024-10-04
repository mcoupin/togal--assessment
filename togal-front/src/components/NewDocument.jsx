import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  CardActions,
  Box,
  Input,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DownloadIcon from "@mui/icons-material/Download";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDocument } from "../services";

const NewDocument = ({ folderId }) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createNewDocument = useMutation({
    mutationFn: postDocument,
    onSuccess: () => {
      queryClient.invalidateQueries("documents");
    },
  });
  const handleCreateDocument = () => {
    createNewDocument.mutate({ title, description, folderId });
    setTitle("");
    setDescription("");
  };
  return (
    <Grid size={{ xs: 12 }}>
      <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Create New Document
          </Typography>

          {/* Title Input */}
          <TextField
            label="Document Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          {/* Description Input */}
          <TextField
            label="Document Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            disabled={!title || !description}
            onClick={handleCreateDocument}
          >
            Create Document
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default NewDocument;
