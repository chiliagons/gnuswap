import React from "react";
import { GenericModal } from "@gnosis.pm/safe-react-components";
import { Typography } from "@material-ui/core";

interface Props {
  setTrigger: any;
  message: string;
  styling: any;
}

export const Modal: React.FC<Props> = ({ setTrigger, message, styling }) => {
  return (
    <GenericModal
      onClose={() => setTrigger(false)}
      title="Error"
      body={
        <div>
          <Typography className={styling} align="center" variant="h6">
            {message}
          </Typography>
        </div>
      }
    />
  );
};
