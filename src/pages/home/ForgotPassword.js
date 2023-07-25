import {
  AppBar,
  Button,
  CssBaseline,
  Grid,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  withStyles,
  Select,
  MenuItem
} from "@material-ui/core";
import clsx from "clsx";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../components/common/Common.css";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/APIService";
import LACLogo from "../../assets/LACLogo2.png";
import CommonFunc from "../../components/common/CommonFunc";
import ForgotPasswordForm from "../cashflow/ForgotPasswordForm";

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: 0,
    width: `calc(100% - ${0}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  alignment: {
    flexGrow: 1,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  topMargin: {
    marginTop: 40,
  },
  backColor: {
    backgroundColor: "#347f58",
  },
  customButtonPrimary: {
    borderRadius: "8px",
    fontWeight: 500,
    color: "#f9f9f9",
    backgroundColor: "#702492",
    "&:hover": {
      backgroundColor: "#702492",
    },
    "&:disabled": {
      backgroundColor: "rgba(0, 0, 0, 0.12)",
    },
    textTransform: "none",
    fontFamily: "poppins",
  },
  btnText: {
    fontSize: 14,
    color: "#702492",
    fontFamily: "poppins",
    textTransform: "none",
  },
});

const withMediaQuery =
  (...args) =>
  (Component) =>
  (props) => {
    const mediaQuery = useMediaQuery(...args);
    return <Component mediaQuery={mediaQuery} {...props} />;
  };

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      email: null,
      password: null,
      errorMessage: null,
      loading: false,
      token: null,
      errors: {
        email: "",
        password: "",
      },
      role: 0,
    };
  }

  navigate = async (event) => {
      event.preventDefault();
      const { history } = this.props;
      history.push("/Home");
    }

  render() {
    const { classes, mediaQuery } = this.props;
    const title = "Long ARC Finance Model";
    const col6 = mediaQuery ? 6 : 12;
    const col3 = mediaQuery ? 6 : 3;

    return (
      <div>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            style={{ backgroundColor: "white" }}
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <Toolbar>
              <Typography variant="h6" className={classes.alignment}>
                <span className="header-font">{title}</span>
              </Typography>

              <div>
                <Button
                  color="primary"
                  className={classes.btnText}
                  onClick={this.redirectToDashboard}
                >
                  About Us
                </Button>
                <Button
                  color="primary"
                  className={classes.btnText}
                  onClick={this.redirectToDashboard}
                >
                  Contact Us
                </Button>
              </div>
            </Toolbar>
          </AppBar>
        </div>

        {this.state.loading ? (
        <Loader />
      ) : (
        <div style={{ marginTop: "20%" }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Grid container spacing={0}>
                <Grid item xs={col3}></Grid>
                <Grid item xs={6} style={{ marginTop: 25 }}>
                  <img src={LACLogo} alt="Logo" width="95%"/>
                </Grid>
                <Grid item xs={col3}></Grid>
              </Grid>
            </Grid>
            { this.state.forgot !== true ? (
            <Grid item xs={6}>
              <Grid item xs={6}>
              {/* <Grid>
                <form 
                // ref={form} 
                // onSubmit={sendEmail}
                >
                <Grid>
                  <TextField fullWidth required="true" size="small" name="user_email" id="txtEmail" label="Email Address"
                      // disabled={!otp} 
                      variant="outlined"/>
                      </Grid>
                      <Grid></Grid>
                      <Grid>
                      <TextField fullWidth required="true" size="small" name="otp" id="text" label="OTP"
                      // disabled={otp} 
                      variant="outlined"/>
                      </Grid>
                      <Grid item xs={6}></Grid>
                      <Grid>
                  <Button type="submit" className={classes.customButtonPrimary} value="Send"> Send otp </Button>
                  <input type="hidden" name="code" />
                  </Grid>
                </form>
                </Grid> */}
                <ForgotPasswordForm></ForgotPasswordForm>
              <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    size="medium"
                    className={classes.customButtonPrimary}
                    color="primary"
                    onClick={this.navigate}
                  >
                    Back to Login
                  </Button>
              </Grid>
            </Grid> ) : null }
          </Grid>
        </div>
      )}
      </div>
    );
  }
  
}

export default withRouter(
  withStyles(useStyles)(withMediaQuery("(min-width:600px)")(ForgotPassword))
);
