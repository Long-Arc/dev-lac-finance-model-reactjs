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
    fundTypes: props.fundTypes,
    shareClasses: props.shareClasses,
    portCos: props.portCoDetails,
    disable: true,
  });

  const [buttonText, setButtonText] = useState('Input Details')

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
      setCashFlowDetails({
        RecordId: props.cashFlowData.RecordId,
        PortCoId: props.cashFlowData.PortCoId,
        FundId: props.cashFlowData.FundId,
        ShareClassId: props.cashFlowData.ShareClassId,
        Date: props.cashFlowData.Date,
        InvestmentCost: props.cashFlowData.InvestmentCost,
        InvEstimatedValue: props.cashFlowData.InvEstimatedValue,
        CreatedBy: null,
        CreatedDate: null,
        ModifiedBy: null,
        ModifiedDate: null,
        fundTypes: props.fundTypes,
        shareClasses: props.shareClasses,
        portCos: props.portCoDetails,
        disable: false
      });
      console.log(props.cashFlowData)
    }
  }, [props.cashFlowData.RecordId, setCashFlowDetails, cashFlowDetails.disable]);

  const addCashFlow = () => {
    if (CommonFunc.validateForm(errors) && validateAllInputs()) {
      cashFlowDetails.ModifiedBy = sessionStorage.getItem("loggedInUser");
      cashFlowDetails.ModifiedDate = new Date();

      if (cashFlowDetails.RecordId === 0) {
        cashFlowDetails.CreatedBy = sessionStorage.getItem("loggedInUser");
        cashFlowDetails.CreatedDate = new Date();
        cashFlowDetails.RecordId = null;
        const newCashFlowDetails = { ...cashFlowDetails };
        delete newCashFlowDetails.fundTypes;
        delete newCashFlowDetails.shareClasses;
        delete newCashFlowDetails.portCos;
        delete newCashFlowDetails.disable;
        create("/cashFlow/createCashFlow", newCashFlowDetails).then((response) => {
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
        const newCashFlowDetails = { ...cashFlowDetails };
        console.log(newCashFlowDetails);
        if (newCashFlowDetails.InvestmentCost) {
          newCashFlowDetails.InvestmentCost = newCashFlowDetails.InvestmentCost.includes('$') ? newCashFlowDetails.InvestmentCost?.replace('$', '')
            : newCashFlowDetails.InvestmentCost;
          newCashFlowDetails.InvestmentCost = newCashFlowDetails.InvestmentCost.includes(',') ? newCashFlowDetails.InvestmentCost?.replace(',', '')
            : newCashFlowDetails.InvestmentCost;
          newCashFlowDetails.InvestmentCost = parseInt(newCashFlowDetails.InvestmentCost);
        }
        if (newCashFlowDetails.InvEstimatedValue) {
          newCashFlowDetails.InvEstimatedValue = newCashFlowDetails.InvEstimatedValue.includes('$') ? newCashFlowDetails.InvEstimatedValue?.replace('$', '')
            : newCashFlowDetails.InvEstimatedValue;
          newCashFlowDetails.InvEstimatedValue = newCashFlowDetails.InvEstimatedValue.includes(',') ? newCashFlowDetails.InvEstimatedValue?.replace(',', '')
            : newCashFlowDetails.InvEstimatedValue;
          newCashFlowDetails.InvEstimatedValue = parseInt(newCashFlowDetails.InvEstimatedValue);
        }
        delete newCashFlowDetails.fundTypes;
        delete newCashFlowDetails.shareClasses;
        delete newCashFlowDetails.portCos;
        delete newCashFlowDetails.disable;
        console.log(id)
        console.log(cashFlowDetails)
        update(`/cashFlow/updateCashFlow/${id}`, newCashFlowDetails, id).then(
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
  }

  const handleChangeInPortCo = (event) => {
    const { name, value } = event.target;
    let inputErrors = errors;
    setCashFlowDetails({
      ...cashFlowDetails,
      [name]: value,
    });
    let input = {
      PortCoId: Number(value),
      FundId: Number(cashFlowDetails.FundId),
      ShareClassId: Number(cashFlowDetails.ShareClassId),
      startDate: null,
      endDate: null,
    };
    console.log(input)
    create("/cashFlow/searchCashFlows", input).then((response) => {
      // Assuming the formatted data is stored in an array called 'formattedData'
      const distinctFunds = [];
      const distinctShares = [];
      const resultFund = [];
      const resultShare = [];

      // Iterate over each record in the data array
      for (let i = 0; i < response.length; i++) {
        const record = response[i];
        const fundId = record.FundId;
        const share = record.ShareClassId
        // Check if the FundId has already been processed
        if (!distinctFunds.includes(fundId)) {
          // Add the record to the result array
          resultFund.push(record);
          // Mark the FundId as processed
          distinctFunds.push(fundId);
        }
        if (!distinctShares.includes(share)) {
          // Add the record to the result array
          resultShare.push(record);
          // Mark the FundId as processed
          distinctShares.push(share);
        }
      }

      resultFund.sort((a, b) => a.FundType.localeCompare(b.FundType))
      //resultPort.sort((a, b) => a.PortCoName.localeCompare(b.PortCoName))
      resultShare.sort((a, b) => a.ShareClass.localeCompare(b.ShareClass))
      let testfundTypes = resultFund.map((res) => (
        <MenuItem value={res.FundId}>{res.FundType}</MenuItem>
      ));

      let testshareClasses = resultShare.map((resShare) => (
        <MenuItem value={resShare.ShareClassId}>
          {resShare.ShareClass}
        </MenuItem>
      ));

      // The 'result' array now contains only one row of each distinct fund
      setCashFlowDetails({
        ...cashFlowDetails,
        [name]: value,
        ["fundTypes"]: testfundTypes,
        ["shareClasses"]: testshareClasses
      });
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

  const handleChangeInFund = (event) => {
    const { name, value } = event.target;
    let inputErrors = errors;
    setCashFlowDetails({
      ...cashFlowDetails,
      [name]: value,
    });
    let input = {
      PortCoId: Number(cashFlowDetails.PortCoId),
      FundId: Number(value),
      ShareClassId: Number(cashFlowDetails.ShareClassId),
      startDate: null,
      endDate: null,
    };
    create("/cashFlow/searchCashFlows", input).then((response) => {
      // Assuming the formatted data is stored in an array called 'formattedData'
      // Assuming the formatted data is stored in an array called 'formattedData'
      const distinctPorts = [];
      const distinctShares = [];
      const resultPort = [];
      const resultShare = [];

      // Iterate over each record in the data array
      for (let i = 0; i < response.length; i++) {
        const record = response[i];
        const portId = record.PortCoId;
        const share = record.ShareClassId
        // Check if the FundId has already been processed
        if (!distinctPorts.includes(portId)) {
          // Add the record to the result array
          resultPort.push(record);
          // Mark the FundId as processed
          distinctPorts.push(portId);
        }
        if (!distinctShares.includes(share)) {
          // Add the record to the result array
          resultShare.push(record);
          // Mark the FundId as processed
          distinctShares.push(share);
        }
      }

      //resultFund.sort((a, b) => a.FundType.localeCompare(b.FundType))
      resultPort.sort((a, b) => a.PortCoName.localeCompare(b.PortCoName))
      resultShare.sort((a, b) => a.ShareClass.localeCompare(b.ShareClass))
      let testPortCos = resultPort.map((resP) => (
        <MenuItem value={resP.PortCoId}>{resP.PortCoName}</MenuItem>
      ));

      let testshareClasses = resultShare.map((resShare) => (
        <MenuItem value={resShare.ShareClassId}>
          {resShare.ShareClass}
        </MenuItem>
      ));

      // The 'result' array now contains only one row of each distinct fund
      setCashFlowDetails({
        ...cashFlowDetails,
        [name]: value,
        ["portCos"]: testPortCos,
        ["shareClasses"]: testshareClasses
      });
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

  const handleChangeInShareClass = (event) => {
    const { name, value } = event.target;
    let inputErrors = errors;
    setCashFlowDetails({
      ...cashFlowDetails,
      [name]: value,
    });
    let input = {
      PortCoId: Number(cashFlowDetails.PortCoId),
      FundId: Number(cashFlowDetails.FundId),
      ShareClassId: Number(value),
      startDate: null,
      endDate: null,
    };
    create("/cashFlow/searchCashFlows", input).then((response) => {
      // Assuming the formatted data is stored in an array called 'formattedData'
      const distinctPorts = [];
      const distinctFunds = [];
      const resultPort = [];
      const resultFund = [];

      // Iterate over each record in the data array
      for (let i = 0; i < response.length; i++) {
        const record = response[i];
        const portId = record.PortCoId;
        const fund = record.FundId
        // Check if the FundId has already been processed
        if (!distinctPorts.includes(portId)) {
          // Add the record to the result array
          resultPort.push(record);
          // Mark the FundId as processed
          distinctPorts.push(portId);
        }
        if (!distinctFunds.includes(fund)) {
          // Add the record to the result array
          resultFund.push(record);
          // Mark the FundId as processed
          distinctFunds.push(fund);
        }
      }

      //resultFund.sort((a, b) => a.FundType.localeCompare(b.FundType))
      resultPort.sort((a, b) => a.PortCoName.localeCompare(b.PortCoName))
      resultFund.sort((a, b) => a.FundType.localeCompare(b.FundType))
      let testPortCos = resultPort.map((resP) => (
        <MenuItem value={resP.PortCoId}>{resP.PortCoName}</MenuItem>
      ));

      let testfundTypes = resultFund.map((resFund) => (
        <MenuItem value={resFund.FundId}>
          {resFund.FundType}
        </MenuItem>
      ));

      // The 'result' array now contains only one row of each distinct fund
      setCashFlowDetails({
        ...cashFlowDetails,
        [name]: value,
        ["portCos"]: testPortCos,
        ["fundTypes"]: testfundTypes
      });
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
      fundTypes: props.fundTypes,
      shareClasses: props.shareClasses,
      portCos: props.portCoDetails,
      disable: true
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

  const startAdding = () => {
    props.getCashFlowDetails();
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
      fundTypes: props.fundTypes,
      shareClasses: props.shareClasses,
      portCos: props.portCoDetails,
      disable: false
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
    setButtonText('Input Details');
  };

  const handleUpdates = () => {
    startAdding();
    setButtonText('Reset');
  }

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
              <Button
                onClick={handleUpdates}
                fullWidth
                color="primary"
                className={classes.customButtonPrimary}
                //disabled={!cashFlowDetails.disable}
                size="medium"> {buttonText} </Button>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                  shrink={!cashFlowDetails.PortCoId ? false : true}
                >
                  Portfolio
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cashFlowDetails.PortCoId}
                  label="PortCo Name"
                  onChange={handleChange}
                  name="PortCoId"
                  disabled={cashFlowDetails.disable}
                >
                  {cashFlowDetails.portCos}
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
                  shrink={!cashFlowDetails.FundId ? false : true}
                >
                  Fund
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={cashFlowDetails.FundId}
                  label="Fund Type"
                  onChange={handleChange}
                  name="FundId"
                  disabled={cashFlowDetails.disable}
                >
                  {cashFlowDetails.fundTypes}
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
                  shrink={!cashFlowDetails.ShareClassId ? false : true}
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
                  disabled={cashFlowDetails.disable}
                >
                  {cashFlowDetails.shareClasses}
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
                  disabled={cashFlowDetails.disable}
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
                  cashFlowDetails.InvEstimatedValue !== null || cashFlowDetails.disable ? true : false
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
                  cashFlowDetails.InvestmentCost !== null || cashFlowDetails.disable ? true : false
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
            disabled={cashFlowDetails.disable}
          >
            {action}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
