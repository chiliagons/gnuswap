import React from "react";
import { Card, GenericModal } from "@gnosis.pm/safe-react-components";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from "@material-ui/core";

import HelpIcon from "@material-ui/icons/Help";

interface Props {
  setTrigger: Function;
  title: string;
  classes: any;
}

export const SupportModal: React.FC<Props> = ({
  setTrigger,
  title,
  classes,
}) => {
  return (
    <GenericModal
      onClose={() => setTrigger(false)}
      title={title}
      body={
        <Card className={classes.supportcard}>
          <Typography className={classes.text} align="center" variant="h6">
            Support
          </Typography>
          <List component="nav" aria-label="main mailbox folders">
            <ListItem>
              <ListItemIcon>
                <HelpIcon />
              </ListItemIcon>
              <Typography className={classes.text}>How it works</Typography>
            </ListItem>
          </List>
          <Divider />
          <List component="nav" aria-label="secondary mailbox folders">
            <ListItem>
              <Typography className={classes.text}>
                1. Choose the receiving network/chain
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                2. Set the asset that you want to swap
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                3. Enter the amount you want to swap
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                2. Enter the reciever address
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                4. Get a quotation from different routers!
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                5. Once quote is received request, Start the swap! Check
                Transactions for Acive Transfers
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                6. Once the transaction has been prepared Finish the transfer
              </Typography>
            </ListItem>
            <ListItem>
              <Typography className={classes.text}>
                7. In case of any issues you can create a support ticket{" "}
                <a
                  target="blank"
                  className={classes.a}
                  href="https://github.com/chiliagons/gnuswap/issues"
                >
                  here
                </a>
              </Typography>
            </ListItem>
          </List>
        </Card>
      }
    />
  );
};
