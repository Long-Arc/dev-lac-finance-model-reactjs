import React, { Component } from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Snackbar
        open={this.props.open}
        autoHideDuration={6000}
        onClose={this.props.onClose}
      >
        <Alert severity={this.props.severity} sx={{ width: "100%" }}>
          {this.props.message}
        </Alert>
      </Snackbar>
    );
  }
}

export default StatusBar;
