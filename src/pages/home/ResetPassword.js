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
import { searchById, update } from "../../api-services/Service";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

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

    const userDetails = {
        UserId: 0,
        Username: null,
        Password: null,
        FirstName: null,
        LastName: null,
        EmailID: null,
        Active: 1,
        DateModified: null
      };
  
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  
  class ResetPassword extends Component {
    constructor(props) {
      super(props);
      this.state = {
        open: false,
        confirmpass: null,
        password: null,
        errorMessage: null,
        loading: false,
        token: null,
        userEmail: null,
        errors: {
          email: "",
          password: "",
        },
        role: 0,
      };
    }

    componentDidMount() {
    const userEmail = new URLSearchParams(this.props.location.search).get('user_email');
    this.setState({ userEmail });
    }
  
    navigate = async () => {
        const { history } = this.props;
        history.push("/Home");
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        userDetails.password = value;
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

    changePass = (event) => {
        event.preventDefault();
        let userId
        //sessionStorage.getItem("loggedInUser")
        searchById("/users/getUserByUserName?userName=email", this.state.userEmail).then(
            (response) => {
                console.log(response)
                userId = response.UserId;
                console.log(userId)
                const newData = { ...userDetails };

                // Remove unnecessary fields from the copied data
                delete newData.UserId;
                delete newData.Username;
                delete newData.FirstName;
                delete newData.LastName;
                delete newData.EmailID;
                delete newData.Active;
                delete newData.DateModified;
                // The new JSON object containing only the "password" field
                const newPasswordData = {
                  Password: newData.password
                };
                update("/users/updatePassword/email", newPasswordData, userId).then(
                    (response) => {
                    this.navigate();
                    }
                );
                  }
        );
        // update("/users/updatePassword/:email", userDetails, email).then(
        //     (response) => {
        //     }
        // );
    }
  
    render() {
      const { classes, mediaQuery } = this.props;
      const title = "Long Arc Investment Dashboard";
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
  
                {/* <div>
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
                </div> */}
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
                <form className="loginForm" onSubmit={this.changePass}> 
                <Grid container spacing={2}>
                  <Grid item xs={col6}>
                    <TextField
                      fullWidth
                      name="password"
                      label="New Password"
                      required
                      size="small"
                      onChange={this.handleChange}
                      noValidate
                      value={this.state.password}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  <Grid item xs={col6}>
                    <TextField
                      fullWidth
                      name="confirmpass"
                      label="Confirm Password"
                      required
                      size="small"
                      onChange={this.handleChange}
                      noValidate
                      value={this.state.confirmpass}
                      type="password"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  <Grid item xs={col6}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="medium"
                      className={classes.customButtonPrimary}
                      color="primary"
                      onClick={this.changePass}
                    >
                      Change Password
                    </Button>
                  </Grid>
                  <Grid item xs={col6}></Grid>
                  {this.state.errorMessage && (
                    <Grid item xs={col6} className="error-main">
                      {this.state.errorMessage}
                    </Grid>
                  )}
                </Grid> 
                </form>
              </Grid> ) : null }
            </Grid>
          </div>
        )}
        </div>
      );
    }
    
  }
  
  export default withRouter(
    withStyles(useStyles)(withMediaQuery("(min-width:600px)")(ResetPassword))
  );
  