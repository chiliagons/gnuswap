import React from "react";
import { Button, GenericModal } from "@gnosis.pm/safe-react-components";

export default class ErrorBoundary extends React.Component<
  {},
  { hasError: Boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <GenericModal
          onClose={() => undefined}
          title="Something Went Wrong"
          body={
            <div>
              <h3>
                Something went wrong. Make sure gnuswap is connected to the
                gnosis vault. Please try again!
              </h3>
            </div>
          }
          footer={
            <Button onClick={() => window.location.reload()} size="md">
              Refresh
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
