import React, { Component, Fragment } from "react";
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
  Link,
  CircularProgress,
  Backdrop,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import ActionRenderer from "../../components/common/ActionRenderer";
import { useStyles } from "../../components/common/useStyles";
import AddCashFlow from "./AddCashFlow";
import { create, get, remove, search } from "../../api-services/Service";
import DeleteConfirmation from "../../components/modal/DeleteConfirmation";
import CommonFunc from "../../components/common/CommonFunc";
import StatusBar from "../../services/snackbarService";
import { ExcelRenderer } from "react-excel-renderer";
import CashFlowDetailsTemplate from "../../assets/CashFlowDetailsTemplate.xlsx";
import { CSVLink } from "react-csv";
import Layout from "../../components/navigation/Layout";
import AddEntry from "./AddEntries";
import EmailContactForm from "./EmailContactForm";

const withMediaQuery =
  (...args) =>
  (Component) =>
  (props) => {
    const mediaQuery = useMediaQuery(...args);
    return <Component mediaQuery={mediaQuery} {...props} />;
  };

class CashFlowDetails extends Component {
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
      openEntry: false,
      showConfirm: false,
      recordId: 0,
      cashFlowData: {},
      openStatusBar: false,
      severity: "success",
      message: "",
      inputFile: null,
      flag: false,
      excelCols: [
        "PortCoName",
        "FundType",
        "ShareClass",
        "Date",
        "InvestmentCost",
        "InvEstimatedValue",
      ],
      columnDefs: [
        {
          headerName: "Portfolio",
          field: "PortCoName",
          cellStyle: { "text-align": "center" },
        },
        {
          headerName: "Fund",
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
          comparator: (valueA, valueB) => {
            if (valueA === null && valueB === null) {
              return 0;
            } else if (valueA === null) {
              return -1;
            } else if (valueB === null) {
              return 1;
            } else {
              const numA = parseFloat(valueA.replace(/[$,]/g, ""));
              const numB = parseFloat(valueB.replace(/[$,]/g, ""));
              return numA - numB;
            }
          },
        },
        {
          headerName: "Estimated Value of Investment",
          field: "InvEstimatedValue",
          cellStyle: { "text-align": "center" },
          comparator: (valueA, valueB) => {
            if (valueA === null && valueB === null) {
              return 0;
            } else if (valueA === null) {
              return -1;
            } else if (valueB === null) {
              return 1;
            } else {
              const numA = parseFloat(valueA.replace(/[$,]/g, ""));
              const numB = parseFloat(valueB.replace(/[$,]/g, ""));
              return numA - numB;
            }
          },
        },
        {
          headerName: "Actions",
          field: "Actions",
          sortable: false,
          filter: false,
          cellRenderer:  sessionStorage.getItem("loggedInRoleId") === "1" ? "actionRenderer" : null,
          cellRendererParams: {
            onClick: () => {}, // Empty function to disable click
          },
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
    this.clearSearchInput();
    this.setState({ open: true })
  }

  addEntry = () => {
    this.setState({ openEntry: true })
  }

  handleClose = () => {
    this.setState({ open: false, cashFlowData: { RecordId: 0 }, openEntry: false });
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
      loading: true,
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
      const formattedData = response.map((data) => {
        return {
          ...data,
          Date: CommonFunc.getDate(data.Date),
          InvestmentCost: data.InvestmentCost !== null && data.InvestmentCost !== undefined ? `${data.InvestmentCost < 0 ? "-$" : "$"}${Math.abs(data.InvestmentCost).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : null,
          InvEstimatedValue: data.InvEstimatedValue !== null && data.InvEstimatedValue !== undefined ? `$${data.InvEstimatedValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` : null, // Adds a dollar sign, formats to 2 decimal places, and adds commas for thousands separator
        };
      });
      this.setState({ rowData: formattedData, loading: false });
      const distinctPorts = [];
      const distinctShares = [];
      const resultPort = [];
      const resultShare = [];
      const distinctFunds = [];
      let resultFund = [];
      for (let i = 0; i < response.length; i++) {
        const record = response[i];
        const portId = record.PortCoId;
        const share = record.ShareClassId;
        const fundId = record.FundId;
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
        if (!distinctFunds.includes(fundId)) {
          // Add the record to the result array
          resultFund.push(record);
          // Mark the FundId as processed
          distinctFunds.push(fundId);
        }
        resultFund = resultFund.sort();
      }

      resultFund.sort((a, b) => a.FundType.localeCompare(b.FundType))
      resultPort.sort((a, b) => a.PortCoName.localeCompare(b.PortCoName))
      resultShare.sort((a, b) => a.ShareClass.localeCompare(b.ShareClass))

  
  // The 'result' array now contains only one row of each distinct fund
      this.setState({ portCoDetails: resultPort, shareClasses: resultShare, fundTypes: resultFund });

      if (this.state.flag) {
        this.setState({ open: true });
        this.state.flag = false;
      }
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
      const formattedData = response.map((data) => {
        return {
          ...data,
          Date: CommonFunc.getDate(data.Date),
          InvestmentCost:
            data.InvestmentCost !== null && data.InvestmentCost !== undefined
              ? `${data.InvestmentCost < 0 ? "-$" : "$"}${Math.abs(data.InvestmentCost).toFixed(2).replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                )}`
              : null,
          InvEstimatedValue:
            data.InvEstimatedValue !== null && data.InvEstimatedValue !== undefined
              ? `$${data.InvEstimatedValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : null, // Adds a dollar sign, formats to 2 decimal places, and adds commas for thousands separator
        };
      });
      this.setState({ rowData: formattedData });
    });    
  };

  componentDidMount() {
    let loggedInUser = sessionStorage.getItem("loggedInUser");

    if (loggedInUser) {
      this.setState({ loading: true });
      this.getPortCoDetails();
      this.getFundTypes();
      this.getShareClasses();
      this.getCashFlowDetails();
      this.getYears();
    } else {
      const { history } = this.props;
      if (history) history.push("/Home");
    }
  }

  editRowData = (row) => {
    this.clearSearchInput();
    this.setState({ open: true, cashFlowData: row });
    console.log(row)
  };

  deleteRowData = (row) => {
    this.setState({ showConfirm: true, recordId: row.RecordId });
  };

  deleteRecord = () => {
    this.setState({ showConfirm: false, recordId: 0, loading: true });
    remove("/cashFlow/deleteCashFlow", this.state.recordId).then((response) => {
      this.getCashFlowDetails();
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChangeInPortCo = (event) => {
  const { name, value } = event.target;
  this.setState({ [name]: value });
  console.log(value)
  let input = {
    PortCoId: Number(value),
    FundId: Number(this.state.FundId),
    ShareClassId: Number(this.state.ShareClassId),
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

// The 'result' array now contains only one row of each distinct fund
    this.setState({ fundTypes: resultFund, shareClasses: resultShare });
    console.log(this.state.fundTypes)
  });
};

handleChangeInFund = (event) => {
  const { name, value } = event.target;
  this.setState({ [name]: value });
  console.log(value)
  let input = {
    PortCoId: Number(this.state.PortCoId),
    FundId: Number(value),
      ShareClassId: Number(this.state.ShareClassId),
      startDate:  null,
      endDate: null,
  };
  console.log(input)
  create("/cashFlow/searchCashFlows", input).then((response) => {
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

// The 'result' array now contains only one row of each distinct fund
    this.setState({ portCoDetails: resultPort, shareClasses: resultShare });
    console.log(this.state.fundTypes)
  });
};

handleChangeInShareClass = (event) => {
  const { name, value } = event.target;
  this.setState({ [name]: value });
  console.log(value)
  let input = {
    PortCoId: Number(this.state.PortCoId),
    FundId: Number(this.state.FundId),
      ShareClassId: Number(value),
      startDate:  null,
      endDate: null,
  };
  console.log(input)
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

// The 'result' array now contains only one row of each distinct fund
    this.setState({ portCoDetails: resultPort, fundTypes: resultFund });
    console.log(this.state.fundTypes)
  });
};

  fileHandler = (event) => {
    let fileObj = event.target.files[0];
    event.target.value = '';
    if (fileObj) {
      this.setState({ loading: true, inputFile: fileObj });
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          console.log(err);
        } else {
          let cols = resp.rows[0];
          if (this.checkExcelColumns(cols)) {
            let newRows = [];
            let userId = sessionStorage.getItem("loggedInUser");
            resp.rows.slice(1).map((row, index) => {
              if (row && row !== "undefined") {
                newRows.push({
                  [cols[0]]: row[0],
                  [cols[1]]: row[1],
                  [cols[2]]: row[2],
                  [cols[3]]: row[3],
                  [cols[4]]: row[4],
                  [cols[5]]: row[5],
                  CreatedBy: userId,
                });
              }
            });

            if (newRows.length === 0) {
              this.setState({
                loading: false,
                openStatusBar: true,
                severity: "error",
                message: "No data found in file",
                inputFile: null,
              });
            } else {
              newRows.map((item, index) => {
                if (item.Date.toString().indexOf('/') === -1 || item.Date.toString().indexOf('-') === -1)
                  newRows[index].Date = CommonFunc.ExcelDateToJSDate(item.Date);
              });
              if (this.validateRowData(newRows)) {
                this.saveRowData(newRows);
              }
            }
          } else {
            this.setState({
              inputFile: null,
              loading: false,
              openStatusBar: true,
              severity: "error",
              message:
                "One or more invalid column(s) found, expected columns are [PortCoName, FundType, ShareClass, Date, InvestmentCost, InvEstimatedValue]",
            });
          }
        }
      });
    } else {
      this.setState({
        inputFile: null,
        loading: false,
        openStatusBar: true,
        severity: "error",
        message: "No file selected",
      });
    }
    event.target.value = null;
  };

  //Check if column name is valid or invalid
  checkExcelColumns = (cols) => {
    if (this.state.excelCols.length === cols.length) {
      var result = this.state.excelCols.filter(function (actualCol) {
        return !cols.includes(actualCol);
      });

      if (result.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  validateRowData = (rowData) => {
    let valid = true;
    let message = "";

    var result = rowData.filter(function (row) {
      let invEstimatedValue = row.InvEstimatedValue
        ? Number(row.InvEstimatedValue)
        : 0;
      let investmentCost = row.InvestmentCost ? Number(row.InvestmentCost) : 0;
      return isNaN(invEstimatedValue) || isNaN(investmentCost);
    });

    if (result.length > 0) {
      valid = false;
      message = "Investment Cost and/or Estimated Value should be numeric";
    }

    if (valid) {
      result = rowData.filter(function (row) {
        let invEstimatedValue = row.InvEstimatedValue
          ? Number(row.InvEstimatedValue)
          : 0;
        let investmentCost = row.InvestmentCost
          ? Number(row.InvestmentCost)
          : 0;
        return invEstimatedValue > 0 && investmentCost > 0;
      });

      if (result.length > 0) {
        valid = false;
        message = "You cannot have both Investment Cost and Estimated Value";
      }
    }

    if (!valid) {
      this.setState({
        openStatusBar: true,
        severity: "error",
        message: message,
        loading: false,
        inputFile: null,
      });
    }
    return valid;
  };

  saveRowData = (rowData) => {
    create("/cashFlow/bulkUploadCashFlow", rowData)
      .then((response) => {
        this.setState({
          openStatusBar: true,
          severity: response.severity,
          message: response.message,
          loading: response.severity === 'error' ? false : true,
          inputFile: null,
        });
        if (response.severity === 'success')
          this.getCashFlowDetails();
      });
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
    this.getCashFlowDetails();
  };

  filterColumns = (data) => {
    const columnMappings = {
      PortCoName: "Portfolio Name",
      FundType: "Fund",
      ShareClass: "Share Class",
      Date: "Start Date",
      InvestmentCost: "Investment Cost",
      InvEstimatedValue: "Estimated Value of Investment"
    };
    const columnsToRemove = ["RecordId","PortCoId","ShareClassId","FundId","CreatedBy",
                            "CreatedDate","ModifiedBy","ModifiedDate","VersionId"];
    const columnOrder = ["PortCoName","FundType","ShareClass","Date",
                        "InvestmentCost","InvEstimatedValue"];
    return data.map((row) => {
      const transformedRow = {};
      columnOrder.forEach((column) => {
        if (row.hasOwnProperty(column)) {
          const renamedColumn = columnMappings[column] || column;
          transformedRow[renamedColumn] = row[column];
        }
      });
      return transformedRow;
    }).map((row) => {
      const filteredRow = { ...row };
      columnsToRemove.forEach((column) => {
        delete filteredRow[column];
      });
      return filteredRow;
    });
  };

  exportData = () => {
    this.csvLink.link.click();
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
      <Layout>
      <Fragment>
        <div>
          <Backdrop className={classes.backdrop} open={this.state.loading}>
            <CircularProgress color="inherit" />
          </Backdrop>

          <AddCashFlow
            open={this.state.open}
            getCashFlowDetails={this.clearSearchInput}
            handleClose={this.handleClose}
            onAddCashFlow={this.onAddCashFlow}
            portCoDetails={portCoDetails}
            fundTypes={fundTypes}
            shareClasses={shareClasses}
            cashFlowData={this.state.cashFlowData}
          />

          <AddEntry
            open={this.state.openEntry}
            getCashFlowDetails={this.clearSearchInput}
            handleClose={this.handleClose}
            onAddCashFlow={this.onAddCashFlow}
            portCoDetails={portCoDetails}
            fundTypes={fundTypes}
            shareClasses={shareClasses}
            cashFlowData={this.state.cashFlowData}
          />

          <DeleteConfirmation
            showConfirm={this.state.showConfirm}
            handleConfirmClose={this.handleConfirmClose}
            deleteRecord={this.deleteRecord}
          />

          {sessionStorage.getItem("loggedInRoleId") !== "1" ? 
          <Grid container spacing={2}>
          <Grid item xs={10}>
            <h2 className="header-text-color">Cash Flow Details</h2>
          </Grid>
          <Grid item xs={2} style={{ margin: "auto" }}>
            <Button
              className={classes.customButtonPrimary}
              variant="contained"
              component="span"
              size="medium"
              style={{ float: "right" }}
              fullWidth
              onClick={this.exportData}
            >Export Data
              <CSVLink 
              data = {this.filterColumns(this.state.rowData)}
              className={classes.exportLink}
              // style={{ display: 'none'}}
              ref={(r)=>(this.csvLink = r)}
              filename={`CashFlowDetails.csv`}></CSVLink>
            </Button>
          </Grid>
        </Grid>
          :
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <h2 className="header-text-color">Cash Flow Details</h2>
            </Grid>
            <Grid item xs={2} style={{ margin: "auto" }}>
              <Link
                style={{ float: "right" }}
                target="_blank"
                download={"CashFlowDetailsTemplate"}
                href={CashFlowDetailsTemplate}
              >
                Download Sample File
              </Link>
            </Grid>
            <Grid item xs={2} style={{ margin: "auto" }}>
              <label htmlFor="inputFile">
                <input
                  style={{ display: "none" }}
                  id="inputFile"
                  name="inputFile"
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => {
                    e.preventDefault();
                    this.fileHandler(e);
                  }}
                />
                <Button
                  className={classes.customButtonPrimary}
                  variant="contained"
                  component="span"
                  size="medium"
                  style={{ float: "right" }}
                  fullWidth
                >
                  Upload File
                </Button>
              </label>
            </Grid>
            <Grid item xs={2} style={{ margin: "auto" }}>
              <Button
                className={classes.customButtonPrimary}
                variant="contained"
                component="span"
                size="medium"
                style={{ float: "right" }}
                fullWidth
                onClick={this.exportData}
              >Export Data
                <CSVLink 
                data = {this.filterColumns(this.state.rowData)}
                className={classes.exportLink}
                // style={{ display: 'none'}}
                ref={(r)=>(this.csvLink = r)}
                filename={`CashFlowDetails.csv`}></CSVLink>
              </Button>
            </Grid>
            <Grid item xs={2} style={{ margin: "auto" }}>
              <Button
                className={classes.customButtonPrimary}
                variant="contained"
                style={{ float: "right" }}
                color="primary"
                onClick={this.addCashFlowDetails}
                size="medium"
                fullWidth
                disabled={sessionStorage.getItem("loggedInRoleId") !== "1"}
              >
                Add Cash Flow
              </Button>
            </Grid>
          </Grid>
  }
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel
                  style={{ fontFamily: "poppins" }}
                  id="demo-simple-select-label"
                  shrink={!this.state.PortCoId ? false : true}
                >
                  Portfolio
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.PortCoId}
                  label="PortCo Name"
                  onChange={this.handleChangeInPortCo}
                  name="PortCoId"
                  style={{ backgroundColor: "#f9f9f9" }}
                  notched={!this.state.PortCoId ? false : true}
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
                  shrink={!this.state.FundId ? false : true}
                >
                  Fund
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.FundId}
                  label="Fund Type"
                  onChange={this.handleChangeInFund}
                  name="FundId"
                  style={{ backgroundColor: "#f9f9f9" }}
                  notched={!this.state.FundId ? false : true}
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
                  shrink={!this.state.ShareClassId ? false : true}
                >
                  Share Class
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.ShareClassId}
                  label="Share Class"
                  onChange={this.handleChangeInShareClass}
                  name="ShareClassId"
                  style={{ backgroundColor: "#f9f9f9" }}
                  notched={!this.state.ShareClassId ? false : true}
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
                  shrink={!this.state.Year ? false : true}
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
                  notched={!this.state.Year ? false : true}
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
                  shrink={!this.state.Quarter ? false : true}
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
                  notched={!this.state.Quarter ? false : true}
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
            {/* <Grid item>
              <Button
                fullWidth
                className={classes.customButtonPrimary}
                variant="contained"
                color="primary"
                onClick={this.addEntry}
                size="medium"
              >
                Add Entry
              </Button>
            </Grid> */}
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
                  pagination={false}
                  gridOptions={this.gridOptions}
                  paginationPageSize={this.state.rowData.length}
                  components={this.state.components}
                  rowClassRules={this.state.rowClassRules}
                  suppressClickEdit={true}
                />
              </div>
            </Grid>
          </Grid>
        </div>
        <StatusBar
          open={this.state.openStatusBar}
          severity={this.state.severity}
          message={this.state.message}
          onClose={() => {
            this.setState({ openStatusBar: false });
          }}
        />
      </Fragment>
      </Layout>
    );
  }
}

export default withRouter(
  withStyles(useStyles)(withMediaQuery("(min-width:600px)")(CashFlowDetails))
);
