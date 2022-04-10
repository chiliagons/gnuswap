import React from "react";
import { GenericModal } from "@gnosis.pm/safe-react-components";
import { Typography } from "@material-ui/core";

interface Props {
  setTrigger: Function;
  title: string;
  message: string;
  styling: string;
}

export const AlertModal: React.FC<Props> = ({
  setTrigger,
  title,
  message,
  styling,
}) => {
  return (
    <GenericModal
      onClose={() => setTrigger(false)}
      title={title}
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
