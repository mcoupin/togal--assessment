import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Document, NewDocument } from "../components";
import Grid from "@mui/material/Grid2";
import { getDocuments } from "../services";
const FolderPage = () => {
  const { folderId } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: ["documents"],
    queryFn: () => getDocuments(folderId),
  });
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <Grid container spacing={3}>
      <NewDocument folderId={folderId} />
      {data.length !== 0 &&
        data
          .sort((a, b) => b.id - a.id)
          .map((document) => (
            <Document key={document.id} document={document} />
          ))}
    </Grid>
  );
};

export default FolderPage;
