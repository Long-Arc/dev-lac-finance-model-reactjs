import React, { useState, useEffect } from "react";
import {
  DialogContent,
  IconButton,
  Grid,
  Dialog,
  TextField,
  DialogActions,
  Button,
  useMediaQuery,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { create, update } from "../../api-services/Service";
import CommonFunc from "../../components/common/CommonFunc";

const useStyles = makeStyles((theme) => ({
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
}));

export default function AddCashFlow(props) {
  const [cashFlowDetails, setCashFlowDetails] = useState({
    RecordId: 0,
    PortCoId: null,
    FundId: null,
    ShareClassId: null,
    Date: null,
    InvestmentCost: null,
    InvEstimatedValue: null,
    CreatedBy: null,
    CreatedDate: null,
    ModifiedBy: null,
    ModifiedDate: null,
  });

  const [errors, setErrors] = useState({
    portCoId: "",
    fundId: "",
    shareClassId: "",
    date: "",
    investmentCost: "",
    estimatedValue: "",
  });

  const matches = useMediaQuery("(min-width:600px)");
  const classes = useStyles();
  const action =
    props.cashFlowData && props.cashFlowData.RecordId > 0
      ? "Update Cash Flow"
      : "Add Cash Flow";

  useEffect(() => {
    if (props.cashFlowData && props.cashFlowData.RecordId > 0) {
      setCashFlowDetails(props.cashFlowData);
    }
  }, [props.cashFlowData.RecordId, setCashFlowDetails]);

  const addCashFlow = () => {
    if (CommonFunc.validateForm(errors) && validateAllInputs()) {
      cashFlowDetails.ModifiedBy = sessionStorage.getItem("loggedInUser");
      cashFlowDetails.ModifiedDate = new Date();

      if (cashFlowDetails.RecordId === 0) {
        cashFlowDetails.CreatedBy = sessionStorage.getItem("loggedInUser");
        cashFlowDetails.CreatedDate = new Date();
        cashFlowDetails.RecordId = null;
        create("/cashFlow/createCashFlow", cashFlowDetails).then((response) => {
          reset();
          props.onAddCashFlow();
        });
      } else {
        let id = cashFlowDetails.RecordId;
        //cashFlowDetails.Date = '2020-01-01';
        delete cashFlowDetails.RecordId;
        delete cashFlowDetails.FundType;
        delete cashFlowDetails.PortCoName;
        delete cashFlowDetails.ShareClass;
        update("/cashFlow/updateCashFlow", cashFlowDetails, id).then(
          (response) => {
            reset();
            props.onAddCashFlow();
          }
        );
      }
    } else {
      showInputErrors();
    }
  };

  const showInputErrors = () => {
    let inputErrors = errors;

    if (!cashFlowDetails.PortCoId) {
      inputErrors.portCoId = "Please select portco name";
    }
    if (!cashFlowDetails.FundId) {
      inputErrors.fundId = "Please select fund type";
    }
    if (!cashFlowDetails.ShareClassId) {
      inputErrors.shareClassId = "Please select share class";
    }
    if (!cashFlowDetails.Date) {
      inputErrors.date = "Please select date";
    }
    if (!cashFlowDetails.InvestmentCost && !cashFlowDetails.InvEstimatedValue) {
      inputErrors.estimatedValue =
        "Please enter either investment cost or estimated value";
    }

    setErrors(inputErrors);
    //number validation
    //currency dropdown
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let inputErrors = errors;

    setCashFlowDetails({
      ...cashFlowDetails,
      [name]: value,
    });

    switch (name) {
      case "PortCoId":
        inputErrors.portCoId =
          value.length <= 0 ? "Please select portco name" : "";
        break;
      case "FundId":
        inputErrors.fundId = value.length <= 0 ? "Please select fund type" : "";
        break;
      case "ShareClassId":
        inputErrors.shareClassId =
          value.length <= 0 ? "Please select share class" : "";
        break;
      default:
      // case 'InvEstimatedValue':
      //     inputErrors.estimatedValue = cashFlowDetails.InvestmentCost.length > 0 && value.length > 0
      //         ? 'Please enter either investment cost or estimated value' : '';
      //     break;
    }

    setErrors(inputErrors);
  };

  const handleDateChange = (date) => {
    if (date) {
      let inputErrors = errors;
      setCashFlowDetails({
        ...cashFlowDetails,
        ["Date"]: date,
      });

      inputErrors.date = date.length <= 0 ? "Please select date" : "";
      setErrors(inputErrors);
    }
  };

  const reset = () => {
    setCashFlowDetails({
      RecordId: 0,
      PortCoId: null,
      FundId: null,
      ShareClassId: null,
      Date: null,
      InvestmentCost: null,
      InvEstimatedValue: null,
      CreatedBy: null,
      CreatedDate: null,
      ModifiedBy: null,
      ModifiedDate: null,
    });

    setErrors({
      portCoId: "",
      fundId: "",
      shareClassId: "",
      date: "",
      investmentCost: "",
      estimatedValue: "",
    });
  };

  const validateAllInputs = () => {
    if (
      !cashFlowDetails.PortCoId ||
      !cashFlowDetails.ShareClassId ||
      !cashFlowDetails.FundId ||
      !cashFlowDetails.Date ||
      (!cashFlowDetails.InvestmentCost && !cashFlowDetails.InvEstimatedValue) ||
      (cashFlowDetails.InvestmentCost && cashFlowDetails.InvEstimatedValue)
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleClose = () => {
    reset();
    props.handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        open={props.open}
        onClose={handleClose}
        disableBackdropClick
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Grid container spacing={0}>
            <Grid item xs={matches ? 11 : 9}></Grid>
            <Grid item xs={matches ? 1 : 3}>
              <IconButton
                style={{ marginLeft: "22px", marginTop: "-20px" }}
                onClick={handleClose}
                aria-label="settings"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                >
                  PortCo Name
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cashFlowDetails.PortCoId}
                  label="PortCo Name"
                  onChange={handleChange}
                  name="PortCoId"
                >
                  {props.portCoDetails}
                </Select>
              </FormControl>
              {errors.portCoId.length > 0 && (
                <span className="error">{errors.portCoId}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                >
                  Fund Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cashFlowDetails.FundId}
                  label="Fund Type"
                  onChange={handleChange}
                  name="FundId"
                >
                  {props.fundTypes}
                </Select>
              </FormControl>
              {errors.fundId.length > 0 && (
                <span className="error">{errors.fundId}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                >
                  Share Class
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cashFlowDetails.ShareClassId}
                  label="Share Class"
                  onChange={handleChange}
                  name="ShareClassId"
                >
                  {props.shareClasses}
                </Select>
              </FormControl>
              {errors.shareClassId.length > 0 && (
                <span className="error">{errors.shareClassId}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  format="yyyy-MM-dd"
                  id="dateUpdated"
                  label="Date"
                  value={cashFlowDetails.Date}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  inputVariant="outlined"
                  size="small"
                  required
                  name="Date"
                />
              </MuiPickersUtilsProvider>
              {errors.date.length > 0 && (
                <span className="error">{errors.date}</span>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="InvestmentCost"
                label="Investment Cost"
                size="small"
                onChange={handleChange}
                noValidate
                value={cashFlowDetails.InvestmentCost}
                variant="outlined"
                style={{ fontFamily: "poppins" }}
                disabled={
                  cashFlowDetails.InvEstimatedValue !== null ? true : false
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="InvEstimatedValue"
                label="Estimated Value"
                size="small"
                onChange={handleChange}
                noValidate
                value={cashFlowDetails.InvEstimatedValue}
                variant="outlined"
                style={{ fontFamily: "poppins" }}
                disabled={
                  cashFlowDetails.InvestmentCost !== null ? true : false
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">$</InputAdornment>
                  ),
                }}
              />
              {errors.estimatedValue.length > 0 && (
                <span className="error">{errors.estimatedValue}</span>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ padding: "8px 24px 16px 24px" }}>
          <Button
            fullWidth
            onClick={addCashFlow}
            color="primary"
            className={classes.customButtonPrimary}
            size="medium"
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
