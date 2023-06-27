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
import { Autocomplete } from "@material-ui/lab";

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

export default function AddEntry(props) {
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
    disablePortco: true,
    disableFund: true,
    disableShareClass: true
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

  useEffect(() => {
    if (props.cashFlowData && props.cashFlowData.RecordId > 0) {
      setCashFlowDetails(props.cashFlowData);
    }
  }, [props.cashFlowData.RecordId, setCashFlowDetails, cashFlowDetails.disable]);

  const addCashFlow = () => {
      cashFlowDetails.ModifiedBy = sessionStorage.getItem("loggedInUser");
      cashFlowDetails.ModifiedDate = new Date();
      cashFlowDetails.CreatedBy = sessionStorage.getItem("loggedInUser");
      cashFlowDetails.CreatedDate = new Date();
      cashFlowDetails.RecordId = null;
      cashFlowDetails.InvestmentCost = 0;
      // create("/cashFlow/createCashFlow", cashFlowDetails).then((response) => {
      //   reset();
      //   props.onAddCashFlow();
      // });
      console.log(cashFlowDetails);
      // } else {
      //   let id = cashFlowDetails.RecordId;
      //   //cashFlowDetails.Date = '2020-01-01';
      //   delete cashFlowDetails.RecordId;
      //   delete cashFlowDetails.FundType;
      //   delete cashFlowDetails.PortCoName;
      //   delete cashFlowDetails.ShareClass;
      //   update("/cashFlow/updateCashFlow", cashFlowDetails, id).then(
      //     (response) => {
      //       reset();
      //       props.onAddCashFlow();
      //     }
      //   );
      // }
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
        ShareClassId: null,
        startDate:  null,
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
        ShareClassId: null,
        startDate:  null,
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
      disablePortco: true,
      disableFund: true,
      disableShareClass: true
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

  const handleUpdates1 = (event) => {
    setCashFlowDetails({
        RecordId: 0,
        PortCoId: null,
        FundId: '',
        ShareClassId: '',
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
        disablePortco: false,
        disableFund: true,
        disableShareClass: true
        });
  }

  const handleUpdates2 = (event) => {
    setCashFlowDetails({
        RecordId: 0,
        PortCoId: '',
        FundId: null,
        ShareClassId: '',
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
        disablePortco: true,
        disableFund: false,
        disableShareClass: true
        });
  }

  const handleUpdates3 = (event) => {
    setCashFlowDetails({
        RecordId: 0,
        PortCoId: '',
        FundId: '',
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
        disablePortco: true,
        disableFund: true,
        disableShareClass: false
        });
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
          {/* <Autocomplete
        id="free-solo-demo"
        freeSolo
        options={cashFlowDetails.fundTypes}
        renderInput={(params) => <TextField {...params} label="freeSolo" />}
      /> */}
          <Grid container spacing={2}>
          <Grid item xs={12}>
          <Button 
              onClick={handleUpdates1}
              //fullWidth
              name="Portfolio"
              color="primary"
              //disabled={!cashFlowDetails.disablePortco}
              className={classes.customButtonPrimary}
              disabled={!cashFlowDetails.disablePortco}
              size="medium"> Add Portfolio </Button>
              </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                  shrink={!cashFlowDetails.disablePortco ? true : false}
                >
                  Portfolio
                </InputLabel>
                <TextField
                    id="demo-simple-select"
                    value={cashFlowDetails.PortCoId}
                    onChange={handleChangeInPortCo}
                    variant='outlined'
                    disabled={cashFlowDetails.disablePortco}
                    size='small'
                    />
              </FormControl>
              {errors.portCoId.length > 0 && (
                <span className="error">{errors.portCoId}</span>
              )}
            </Grid>
            <Grid item xs={12}>
          <Button 
              onClick={handleUpdates2}
              //fullWidth
              color="primary"
              className={classes.customButtonPrimary}
              disabled={!cashFlowDetails.disableFund}
              size="medium"> Add Fund </Button>
              </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                  shrink={!cashFlowDetails.disableFund ? true : false}
                >
                  Fund
                </InputLabel>
                <TextField
                    id="demo-simple-select"
                    value={cashFlowDetails.FundId}
                    onChange={handleChangeInFund}
                    variant='outlined'
                    disabled={cashFlowDetails.disableFund}
                    size='small'
                />
              </FormControl>
              {errors.fundId.length > 0 && (
                <span className="error">{errors.fundId}</span>
              )}
            </Grid>
            <Grid item xs={12}>
          <Button 
              onClick={handleUpdates3}
              //fullWidth
              color="primary"
              className={classes.customButtonPrimary}
              disabled={!cashFlowDetails.disableShareClass}
              size="medium"> Add Share Class </Button>
              </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" required size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                  shrink={!cashFlowDetails.disableShareClass ? true : false}
                >
                  Share Class
                </InputLabel>
                <TextField
                    id="demo-simple-select"
                    value={cashFlowDetails.ShareClassId}
                    onChange={handleChange}
                    variant='outlined'
                    disabled={cashFlowDetails.disableShareClass}
                    size='small'
                />
              </FormControl>
              {errors.shareClassId.length > 0 && (
                <span className="error">{errors.shareClassId}</span>
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
            disabled={cashFlowDetails.disablePortco && cashFlowDetails.disableFund && cashFlowDetails.disableShareClass}
          >
            Add Entry
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
