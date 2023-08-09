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
import { ca } from "date-fns/locale";

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

  const addEntry = () => {

    if(cashFlowDetails.PortCoId != "") {
      let newPortco = {
        PortCoName: cashFlowDetails.PortCoId
      }
      create("/portCoDetails/createPortCo", newPortco).then((response) => {
        console.log(response)
        props.onAddCashFlow();
      })
    } 
    
    else if (cashFlowDetails.FundId != "") {
      let newFund = {
        FundType: cashFlowDetails.FundId
      }
      create("/fundTypes/createFund", newFund).then((response) => {
        console.log(response)
        props.onAddCashFlow();
      })
    } 
    
    else if (cashFlowDetails.ShareClassId != "") {
      let newShareClass = {
        ShareClass: cashFlowDetails.ShareClassId
      }
      create("/shareClass/createShareClass", newShareClass).then((response) => {
        console.log(response)
        props.onAddCashFlow();
      })
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let inputErrors = errors;
    setCashFlowDetails({
      ...cashFlowDetails,
      [name]: value,
    });
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
                    name="PortCoId"
                    id="demo-simple-select"
                    value={cashFlowDetails.PortCoId}
                    onChange={handleChange}
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
                    name="FundId"
                    id="demo-simple-select"
                    value={cashFlowDetails.FundId}
                    onChange={handleChange}
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
                    name="ShareClassId"
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
            onClick={addEntry}
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
