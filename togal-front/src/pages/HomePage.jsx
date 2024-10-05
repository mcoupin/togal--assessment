import React from "react";
import { useQuery } from "@tanstack/react-query";
import { NewFolder, Folder } from "../components";
import Grid from "@mui/material/Grid2";
import { getFolders } from "../services";
const HomePage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["folders"],
    queryFn: getFolders,
  });

  if (isPending) return "Loading...";

  if (error && error.status !== 204)
    return "An error has occurred: " + error.message;
  return (
    <Grid container spacing={3}>
      <NewFolder />
      {data
        .sort((a, b) => b.id - a.id)
        .map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
    </Grid>
  );
};

export default HomePage;
