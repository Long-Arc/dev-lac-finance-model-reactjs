import React, { Component } from "react";
import "../../components/common/Common.css";
import {
  Button,
  Grid,
  withStyles,
  Select,
  MenuItem,
  useMediaQuery,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import ActionRenderer from "../../components/common/ActionRenderer";
import { useStyles } from "../../components/common/useStyles";
import { create, get, remove, search } from "../../api-services/Service";
import DeleteConfirmation from "../../components/modal/DeleteConfirmation";
import CommonFunc from "../../components/common/CommonFunc";
import StatusBar from "../../services/snackbarService";

const withMediaQuery =
  (...args) =>
  (Component) =>
  (props) => {
    const mediaQuery = useMediaQuery(...args);
    return <Component mediaQuery={mediaQuery} {...props} />;
  };

class ShareClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PortCoId: null,
      ShareClassId: null,
      FundId: null,
      Year: null,
      Quarter: null,
      portCoDetails: [],
      fundTypes: [],
      shareClasses: [],
      years: [],
      errorMessage: null,
      loading: false,
      userId: null,
      open: false,
      showConfirm: false,
      recordId: 0,
      cashFlowData: {},
      openStatusBar: false,
      severity: "success",
      message: "",
      columnDefs: [
        {
          headerName: "PortoCo Name",
          field: "PortCoName",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Fund Type",
          field: "FundType",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Share Class",
          field: "ShareClass",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Start Date",
          field: "Date",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Investment Cost",
          field: "InvestmentCost",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Estimated Value",
          field: "InvEstimatedValue",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Actions",
          field: "Actions",
          sorting: false,
          filter: false,
          cellRenderer: "actionRenderer",
          cellStyle: { "text-align": "center" },
        },
      ],
      context: { componentParent: this },
      frameworkComponents: { actionRenderer: ActionRenderer },
      rowData: [],
      defaultColDef: {
        flex: window.innerWidth <= 600 ? 0 : 1,
        sortable: true,
        resizable: true,
        filter: true,
      },
      rowClassRules: {
        "grid-row-even": function (params) {
          return params.node.rowIndex % 2 === 0;
        },
        "grid-row-odd": function (params) {
          return params.node.rowIndex % 2 !== 0;
        },
      },
    };
  }

  addCashFlowDetails = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, cashFlowData: { RecordId: 0 } });
  };

  handleConfirmClose = () => {
    this.setState({ showConfirm: false, recordId: 0 });
  };

  onAddCashFlow = () => {
    this.setState({
      open: false,
      openStatusBar: true,
      severity: "success",
      message: "Details saved succesfully",
      cashFlowData: { RecordId: 0 },
    });
    this.getCashFlowDetails();
  };

  getPortCoDetails = () => {
    get("/portCoDetails").then((response) => {
      this.setState({ portCoDetails: response });
    });
  };

  getFundTypes = () => {
    get("/fundTypes").then((response) => {
      this.setState({ fundTypes: response });
    });
  };

  getShareClasses = () => {
    get("/shareClass").then((response) => {
      this.setState({ shareClasses: response });
    });
  };

  getYears = () => {
    get("/cashFlow/getDistinctYears").then((response) => {
      this.setState({ years: response });
    });
  };

  getCashFlowDetails = () => {
    get("/cashFlow").then((response) => {
      response.map((data, index) => {
        response[index].Date = CommonFunc.getDate(data.Date);
      });
      this.setState({ rowData: response });
    });
  };

  searchCashFlowDetails = () => {
    let startMMDD, endMMDD;
    switch (this.state.Quarter) {
      case "Q1":
        startMMDD = "01/01/";
        endMMDD = "03/31/";
        break;
      case "Q2":
        startMMDD = "04/01/";
        endMMDD = "06/30/";
        break;
      case "Q3":
        startMMDD = "07/01/";
        endMMDD = "09/30/";
        break;
      case "Q4":
        startMMDD = "10/01/";
        endMMDD = "12/31/";
        break;
      default:
        startMMDD = "01/01/";
        endMMDD = "12/31/";
        break;
    }

    let input = {
      PortCoId: Number(this.state.PortCoId),
      FundId: Number(this.state.FundId),
      ShareClassId: Number(this.state.ShareClassId),
      startDate: this.state.Year ? startMMDD + this.state.Year : null,
      endDate: this.state.Year ? endMMDD + this.state.Year : null,
    };
    create("/cashFlow/searchCashFlows", input).then((response) => {
      response.map((data, index) => {
        response[index].Date = CommonFunc.getDate(data.Date);
      });
      this.setState({ rowData: response });
    });
  };

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("loggedInUser");

    if (loggedInUser) {
    //   this.setState({ loading: true });
    //   this.getPortCoDetails();
    //   this.getFundTypes();
    //   this.getShareClasses();
    //   this.getCashFlowDetails();
    //   this.getYears();
    //   this.setState({ loading: false });
    } else {
      const { history } = this.props;
      if (history) history.push("/Home");
    }
  }

  editRowData = (row) => {
    this.setState({ open: true, cashFlowData: row });
  };

  deleteRowData = (row) => {
    this.setState({ showConfirm: true, recordId: row.RecordId });
  };

  deleteRecord = () => {
    this.setState({ showConfirm: false, recordId: 0 });
    remove("/cashFlow/deleteCashFlow", this.state.recordId).then((response) => {
      this.getCashFlowDetails();
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  reset = () => {
    this.setState({
      PortCoId: null,
      ShareClassId: null,
      FundId: null,
      Year: null,
      Quarter: null,
    });
  };

  clearSearchInput = () => {
    this.reset();
  };

  render() {
    const { classes, mediaQuery } = this.props;

    let portCoDetails = this.state.portCoDetails.map((portCo) => (
      <MenuItem value={portCo.PortCoId}>{portCo.PortCoName}</MenuItem>
    ));
    let fundTypes = this.state.fundTypes.map((fundType) => (
      <MenuItem value={fundType.FundId}>{fundType.FundType}</MenuItem>
    ));
    let shareClasses = this.state.shareClasses.map((shareClass) => (
      <MenuItem value={shareClass.ShareClassId}>
        {shareClass.ShareClass}
      </MenuItem>
    ));
    let years = this.state.years.map((year) => (
      <MenuItem value={year.Year}>{year.Year}</MenuItem>
    ));

    return (
      <div>
        {this.state.loading ? (
          <Loader />
        ) : (
          <div>
            <Grid container spacing={0}>
              <Grid item xs={3}>
                <h2 className="header-text-color">Share Class</h2>
              </Grid>
              {/* <Grid item xs={9} style={{ margin: "auto" }}>
                <Button
                  className={classes.customButtonPrimary}
                  variant="contained"
                  style={{ float: "right" }}
                  color="primary"
                  onClick={this.addCashFlowDetails}
                  size="medium"
                >
                  Add Cash Flow
                </Button>
              </Grid> */}
            </Grid>
            {/* <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    style={{ fontFamily: "poppins" }}
                    id="demo-simple-select-label"
                  >
                    PortCo Name
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.PortCoId}
                    label="PortCo Name"
                    onChange={this.handleChange}
                    name="PortCoId"
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {portCoDetails}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    style={{ fontFamily: "poppins" }}
                    id="demo-simple-select-label"
                  >
                    Fund Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.FundId}
                    label="Fund Type"
                    onChange={this.handleChange}
                    name="FundId"
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {fundTypes}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    style={{ fontFamily: "poppins" }}
                    id="demo-simple-select-label"
                  >
                    Share Class
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.ShareClassId}
                    label="Share Class"
                    onChange={this.handleChange}
                    name="ShareClassId"
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {shareClasses}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    style={{ fontFamily: "poppins" }}
                    id="demo-simple-select-label"
                  >
                    Year
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.Year}
                    label="Year"
                    onChange={this.handleChange}
                    name="Year"
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    {years}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    style={{ fontFamily: "poppins" }}
                    id="demo-simple-select-label"
                  >
                    Quarter
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.Quarter}
                    label="Quarter"
                    onChange={this.handleChange}
                    name="Quarter"
                    style={{ backgroundColor: "#f9f9f9" }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    <MenuItem value="Q1">Q1</MenuItem>
                    <MenuItem value="Q2">Q2</MenuItem>
                    <MenuItem value="Q3">Q3</MenuItem>
                    <MenuItem value="Q4">Q4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  className={classes.customButtonSecondary}
                  variant="contained"
                  color="primary"
                  onClick={this.clearSearchInput}
                  size="medium"
                >
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  className={classes.customButtonPrimary}
                  variant="contained"
                  color="primary"
                  onClick={this.searchCashFlowDetails}
                  size="medium"
                >
                  Search
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={0}>
              <Grid item xs={12}>
                <div
                  className="ag-theme-alpine"
                  style={{ width: "100%", height: 450, marginTop: 20 }}
                >
                  <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}
                    defaultColDef={this.state.defaultColDef}
                    frameworkComponents={this.state.frameworkComponents}
                    context={this.state.context}
                    pagination={true}
                    gridOptions={this.gridOptions}
                    paginationPageSize={20}
                    components={this.state.components}
                    rowClassRules={this.state.rowClassRules}
                    suppressClickEdit={true}
                  />
                </div>
              </Grid>
            </Grid> */}
          </div>
        )}
        <StatusBar
          open={this.state.openStatusBar}
          severity={this.state.severity}
          message={this.state.message}
          onClose={() => {
            this.setState({ openStatusBar: false });
          }}
        />
      </div>
    );
  }
}

export default withRouter(
  withStyles(useStyles)(withMediaQuery("(min-width:600px)")(ShareClass))
);
