import * as React from "react";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

export default function LinearColor() {
  return (
    <Stack sx={{ width: "50%", color: "grey.500" }} spacing={8}>
      <LinearProgress color="primary" />
      <LinearProgress color="secondary" />
      <LinearProgress color="success" />
    </Stack>
  );
}
