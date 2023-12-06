// Loading.tsx
import React from "react";
import { CircularProgress, Box } from "@mui/material";

interface LoadingProps {
  dark?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ dark = false }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      bgcolor={dark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"}
      zIndex={9999}
    >
      <CircularProgress color={dark ? "secondary" : "primary"} />
    </Box>
  );
};

export default Loading;
