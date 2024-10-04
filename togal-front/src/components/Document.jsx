import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Document = ({ document }) => {
  const queryClient = useQueryClient();
  const downloadFile = useQuery({
    queryKey: ["file"],
    queryFn: async () => {
      try {
        const downloadedFile = await fetch(
          `http://localhost:3000/files/download/${selectedFile.s3Key}`,
          {
            method: "GET",
            headers: {
              "Content-Type": selectedFile.type,
              "content-disposition": `attachment; filename=${selectedFile.name}`,
            },
          }
        );
        const blob = await downloadedFile.blob();

        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = window.document.createElement("a");

        link.href = url;
        link.setAttribute("download", selectedFile.s3);
        link.download = selectedFile.name;
        window.document.body.appendChild(link);

        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        return error;
      }
      return downloadedFile;
    },
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: false, // disable this query from automatically running
  });

  const uploadFile = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("http://localhost:3000/files/upload", {
        method: "POST",
        body: formData,
      });
      return await response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries("documents");
    },
  });

  const [selectedFile, setSelectedFile] = useState(
    document.files[document.files.length - 1]
  );

  useEffect(() => {
    setSelectedFile(document.files[document.files.length - 1]);
  }, [document]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.value);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentId", document.id);
    uploadFile.mutate(formData);
  };

  const formatUploadDate = (uploadDate) => {
    const date = new Date(uploadDate);
    return date.toLocaleString();
  };

  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Card sx={{ maxWidth: 600, margin: "20px auto" }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {document.title}
          </Typography>

          <Typography variant="body1" color="text.secondary" gutterBottom>
            {document.description}
          </Typography>

          <TextField
            select
            label="Select a file"
            value={selectedFile}
            onChange={handleFileChange}
            fullWidth
            variant="outlined"
            margin="normal"
          >
            {document.files.map((file, index) => {
              const fileNameSplit = file.name.split(".");
              const extension = fileNameSplit[fileNameSplit.length - 1];
              const formatedVersion =
                fileNameSplit.slice(0, fileNameSplit.length - 1).join() +
                `V${index + 1}` +
                "." +
                extension;
              return (
                <MenuItem key={index} value={file}>
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12 }}>{formatedVersion}</Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded: {formatUploadDate(file.uploadDate)}
                      </Typography>
                    </Grid>
                  </Grid>
                </MenuItem>
              );
            })}
          </TextField>
        </CardContent>

        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            disabled={!selectedFile}
            onClick={() => {
              downloadFile.refetch();
            }}
          >
            Download
          </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default Document;
