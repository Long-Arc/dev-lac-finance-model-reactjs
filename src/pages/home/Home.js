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
} from "@material-ui/core";
import clsx from "clsx";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../components/common/Common.css";
import Loader from "../../components/loader/Loader";
import { post } from "../../services/APIService";
import LACLogo from "../../assets/LACLogo2.png";
import CommonFunc from "../../components/common/CommonFunc";

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

class Home extends Component {
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
    };
  }

  getToken = async () => {
    await post("app/login", {
      username: this.state.email,
      password: this.state.password,
    })
      .then((response) => response.json())
      .then((actualData) =>
        this.setState({ token: actualData.token, loading: false })
      )
      .catch((err) => {
        this.setState({ token: null });
        console.log(err.message);
      });
  };

  loginToDashboard = async (event) => {
    event.preventDefault();
    if (
      CommonFunc.validateForm(this.state.errors) &&
      this.state.email &&
      this.state.password
    ) {
      this.setState({ loading: true });

      await this.getToken();
      const { history } = this.props;
      if (history && this.state.token !== undefined) {
        sessionStorage.setItem("loggedInUser", this.state.email);
        await sessionStorage.setItem("secretToken", this.state.token);
        history.push("/home/cashflowdetails");
      } else {
        let errors = this.state.errors;
        if (!this.state.email) {
          errors.email = "Please enter valid email address";
        }
        if (!this.state.password) {
          errors.password = "Please enter correct password";
        }
        this.setState({ errors, errorMessage: null });
      }
    } else {
      let errors = this.state.errors;
      if (!this.state.email) {
        errors.email = "Please enter email address";
      }
      if (!this.state.password) {
        errors.password = "Please enter password";
      }
      this.setState({ errors, errorMessage: null });
    }
  };

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case "email":
        this.state.email = value;
        errors.email =
          value.length <= 0
            ? "Please enter email address"
            : !validEmailRegex.test(value)
            ? "Email address is not valid"
            : "";
        break;
      case "password":
        this.state.password = value;
        errors.password = value.length <= 0 ? "Please enter password" : "";
        break;
      default:
        break;
    }
    this.setState({ errors, [name]: value });
  };

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
                    <img src={LACLogo} alt="Logo" height="60%" />
                  </Grid>
                  <Grid item xs={col3}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2}>
                  <Grid item xs={col6}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email"
                      required
                      size="small"
                      onChange={this.handleChange}
                      noValidate
                      value={this.state.email}
                      variant="outlined"
                    />
                    {this.state.errors.email.length > 0 && (
                      <span className="error">{this.state.errors.email}</span>
                    )}
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  <Grid item xs={col6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      required
                      size="small"
                      onChange={this.handleChange}
                      noValidate
                      value={this.state.password}
                      type="password"
                      variant="outlined"
                    />
                    {this.state.errors.password.length > 0 && (
                      <span className="error">
                        {this.state.errors.password}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  <Grid item xs={col6}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="medium"
                      className={classes.customButtonPrimary}
                      color="primary"
                      onClick={this.loginToDashboard}
                    >
                      Login
                    </Button>
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  {this.state.errorMessage && (
                    <Grid item xs={col6} className="error-main">
                      {this.state.errorMessage}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(
  withStyles(useStyles)(withMediaQuery("(min-width:600px)")(Home))
);
