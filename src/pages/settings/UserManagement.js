import React, { Component } from 'react';
import '../../components/common/Common.css';
import { Button, TextField, Grid, withStyles, Select, MenuItem, useMediaQuery } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ActionRenderer from '../../components/common/ActionRenderer';
import CreateIcon from '@material-ui/icons/Create';
import { useStyles } from '../../components/common/useStyles';
import { useState } from 'react';
import { update, reset, get, create } from '../../api-services/Service';
import { NotificationContainer } from 'react-notifications';
import Layout from '../../components/navigation/Layout';
import EmailContactForm from '../cashflow/EmailContactForm';

const withMediaQuery = (...args) => Component => props => {
    const mediaQuery = useMediaQuery(...args);    
    return <Component mediaQuery={mediaQuery} {...props} />;
};

const validateForm = (errors) => {
    let valid = true;
    Object.keys(errors).map(function (e) {
        if (errors[e].length > 0) {
            valid = false;
        }        
    });
    return valid;
}

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

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: 3, fullName: null, email: null, mobileNo: null, role: '0', password: null, newpassword: null, confirmnewpassword: null,
            errorMessage: null, loading: false, actionName: 'CREATE',
            errors: {
                fullName: '',
                email: '',
                mobileNo: '',
                role: '',
                password: '',
            },
            columnDefs: [
                { headerName: 'First Name', field: 'FirstName', cellStyle: { 'text-align': "center" } },
                { headerName: 'Mobile No', field: 'MobileNo', cellStyle: { 'text-align': "center" } },                
                { headerName: 'Email', field: 'EmailId', cellStyle: { 'text-align': "center" } },
                { headerName: 'Password', field: 'Password', cellStyle: { 'text-align': "center" } },
                { headerName: 'Role', field: 'Role', cellStyle: { 'text-align': "center" } },
                { headerName: 'Actions', field: 'Actions', sorting: false, filter: false, cellRenderer: 'actionRenderer', cellStyle: { 'text-align': "center" } },
            ],
            context: { componentParent: this },
            frameworkComponents: { actionRenderer: ActionRenderer },
            rowData: [],
            defaultColDef: { flex: window.innerWidth <= 600 ? 0 : 1, width: 110, sortable: true, resizable: true, filter: true },
            rowClassRules: {
                'grid-row-even': function (params) { return params.node.rowIndex % 2 === 0; },
                'grid-row-odd': function (params) { return params.node.rowIndex % 2 !== 0; }
            },
        };
    }

    validateAllInputs(){
        if(this.state.fullName && this.state.email && this.state.mobileNo && this.state.role && this.state.password) {
                return true;
        }
        else{
            return false;
        }
    }

    create = (event) => {
        event.preventDefault();
        if (validateForm(this.state.errors) && this.validateAllInputs()) {
            this.setState({ loading: true });
            let newUser = {};            
            newUser.UserId = this.state.userId;
            newUser.FullName = this.state.fullName;
            newUser.Email = this.state.email;
            newUser.MobileNo = this.state.mobileNo;
            newUser.Role = this.state.role;
            newUser.Password = this.state.password;
            this.createUser(newUser);
        } else {
            let errors = this.state.errors;
            if (!this.state.fullName) {
                errors.fullName = 'Full name is required';
            }
            if (!this.state.email) {
                errors.email = 'Email is required';
            }
            if (!this.state.mobileNo) {
                errors.mobileNo = 'Mobile number is required';
            }
            if (!this.state.password) {
                errors.password = 'Password is required';
            }
            if (this.state.role === '0') {
                errors.role = 'Select role';
            }
            this.setState({ errors, errorMessage: null });
        }
    }

    loadUsers(){
        get("/users").then((response) => {
            const formattedData = response.map((fdata) => {
                return {
                    ...fdata,
                  Email: fdata.EmailID,
                };
            });
            this.setState({ rowData: formattedData, loading: false });
            console.log(response)
        });
    }

    DeleteRecord(){
        let UserId = this.state.userId;
        let partialUrl //= api.URL;
        fetch(partialUrl + 'Home/RemoveUser?UserId=' + UserId, {
            method: 'POST',
            mode: 'cors'
        }).then(data => {
            this.loadUsers();
        });
    }

    componentDidMount() {
        let loggedInUser = sessionStorage.getItem('loggedInUser');

        if(loggedInUser) {
            this.setState({ loading: false })
            this.loadUsers();
        } else {
            const { history } = this.props;
            if (history) history.push('/Home');
        }
    }

    editGridRow = row => {
        this.setState({
            userId: row.UserId,
            fullName: row.FullName,
            email: row.Email,
            mobileNo: row.MobileNo,
            password: row.Password,
            role: row.Role,
            actionName: 'UPDATE'
        })
    };

    showConfirmPopup = row => {
        this.setState({ userId: row.UserId })
        this.refs.cnfrmModalComp.openModal();
    }

    createUser(newUser) {
        console.log(newUser)
        create("/users/createUser", newUser).then((response) => {
        console.log(response)
        this.loadUsers()
        })
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;

        userDetails.password = value;

        switch (name) {
            case 'fullName':
                this.state.fullName = value;
                errors.fullName = value.length <= 0 ? 'Full name is required' : '';
                break;
            case 'mobileNo':
                this.state.mobileNo = value;
                errors.mobileNo = value.length <= 0 ? 'Mobile number is required' : !Number(value) ? 'Mobile number is not valid' : '';
                break;
            case 'email':
                this.state.email = value;
                errors.email = value.length <= 0 ? 'Email is required' : !validEmailRegex.test(value) ? 'Email is not valid' : '';
                break;            
            case 'password':
                this.state.password = value;
                errors.password = value.length <= 0 ? 'Password is required' : '';
                break;
            default:
                break;
        }
        this.setState({ errors, [name]: value });
    }

    onRoleChanged(e) {
        let Role = e.target.value; 
        this.setState({ role: Role });
        if(Role === '0'){
            this.state.errors.role = 'Select role';
        }else{
            this.state.errors.role = '';
        }
    };

    changeNewpass = () => {

    }

    changePass = () => {
        let email = sessionStorage.getItem("loggedInUser");
        console.log(email);
        console.log(this.state.newpassword);
        console.log(this.state.confirmnewpassword);
        console.log(userDetails.Password);
        userDetails.Password = this.state.newpassword
        console.log(userDetails.Password);
        // update("/users/updatePassword", userDetails, email).then(
        //     (response) => {
        //       reset();
        //       props.onAddCashFlow();
        //     }
        // );
    };

    render() {
        const { classes, mediaQuery } = this.props;
        const col6 = mediaQuery ? 6 : 12;
        const col4 = mediaQuery ? 4 : 12;
        const col10 = mediaQuery ? 10 : 0;
        const col2 = mediaQuery ? 2 : 12;        
        
        return (
            <Layout>
                {/* <h2 className="header-text-color">User Management</h2>
                <EmailContactForm></EmailContactForm> */}
                { sessionStorage.getItem("loggedInUser") === "financedev@longarc.com" ? ( 
            <div>
                {this.state.loading ? (
                    <Loader />
                ) : ( 
                    <div>
                        <form onSubmit={this.loginToDashboard} noValidate>
                            <h2 className="header-text-color">User Management</h2>
                            <Grid container spacing={3}>
                                {/* <Grid item xs={col10}>
                                    <EmailContactForm></EmailContactForm>
                                </Grid> */}
                                <Grid item xs={col10}></Grid>
                                <Grid item xs={col6}>
                                    <TextField fullWidth required="true" name="fullName" id="txtFullName" label="Full Name"
                                        onChange={this.handleChange} noValidate value={this.state.fullName} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                    {this.state.errors.fullName.length > 0 &&
                                        <span className='error'>{this.state.errors.fullName}</span>}
                                </Grid>
                                <Grid item xs={col6}>
                                <TextField fullWidth required="true" name="email" id="txtEmail" label="Email Address"
                                        onChange={this.handleChange} noValidate value={this.state.email} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                        {this.state.errors.email.length > 0 &&
                                        <span className='error'>{this.state.errors.email}</span>}
                                </Grid>                                
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={col4}>
                                <TextField fullWidth required="true" name="mobileNo" id="txtMobileNo" label="Mobile Number"
                                        onChange={this.handleChange} noValidate value={this.state.mobileNo} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                        {this.state.errors.mobileNo.length > 0 &&
                                        <span className='error'>{this.state.errors.mobileNo}</span>}
                                </Grid>
                                <Grid item xs={col4}>
                                <TextField fullWidth required="true" name="password" id="txtPassword" label="Password"
                                        onChange={this.handleChange} noValidate value={this.state.password} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                        {this.state.errors.password.length > 0 &&
                                        <span className='error'>{this.state.errors.password}</span>}
                                </Grid>
                                <Grid item xs={col4}>
                                <Select fullWidth id="ddlRole" value={this.state.role} className="selectTopMargin"
                                        onChange={ (e)=> this.onRoleChanged(e) }>
                                        <MenuItem value="0">Choose Role</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Sales Officer">Sales Officer</MenuItem>
                                        <MenuItem value="Delivery">Delivery</MenuItem>                                        
                                    </Select>
                                    {this.state.errors.role.length > 0 &&
                                        <span className='error'>{this.state.errors.role}</span>}
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={col10}>                                    
                                </Grid>
                                <Grid item xs={col2}>
                                <Button fullWidth className={classes.root} variant="contained"
                                        color="primary" onClick={this.create}>
                                        <CreateIcon className={classes.leftIcon} />{ this.state.actionName }</Button>
                                </Grid>
                            </Grid>
                        </form>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                            <div className="ag-theme-alpine" style={{ width: "100%", height: 450, marginTop: 10 }}>
                                    <AgGridReact
                                        columnDefs={this.state.columnDefs} rowData={this.state.rowData}
                                        onGridReady={this.onGridReady} defaultColDef={this.state.defaultColDef}
                                        frameworkComponents={this.state.frameworkComponents} context={this.state.context}
                                        pagination={true} gridOptions={this.gridOptions} paginationAutoPageSize={true}
                                        components={this.state.components} rowClassRules={this.state.rowClassRules} 
                                        suppressClickEdit={true}
                                    />
                                </div>
                            </Grid>                        
                        </Grid>
                        <h3 className="header-text-color">Change Password</h3>
                            <Grid container spacing={2}>
                            <Grid item xs={col6}>
                                <TextField
                                //fullWidth
                                name="new password"
                                label="New Password"
                                required
                                size="small"
                                onChange={this.handleChange}
                                noValidate
                                value={userDetails.newpassword}
                                variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={col6}></Grid>
                            <Grid item xs={col6}>
                                <TextField
                                //fullWidth
                                name="confirm password"
                                label="Confirm Password"
                                required
                                size="small"
                                onChange={this.handleChange}
                                noValidate
                                value={userDetails.confirmnewpassword}
                                type="password"
                                variant="outlined"
                                />
                                {this.state.errors.password.length > 0 && (
                                <span className="error">
                                    {this.state.errors.password}
                                </span>
                                )}
                                {this.state.errorMessage === "Incorrect Credentials" && (
                                <span className="passError">
                                    {this.state.errorMessage}
                                </span>
                                )}
                            </Grid>
                            <Grid item xs={col6}></Grid>
                            <Grid item xs={col6}>
                                <Button
                                type="button"
                                //fullWidth
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
                            </Grid>
                    </div>
                    )}
            </div> ) :  
            <div>
            {/* <h2 className="header-text-color">User Management</h2> */}
            <h3 className="header-text-color">Change Password</h3>
            <Grid container spacing={2}>
            <Grid item xs={col6}>
                <TextField
                //fullWidth
                name="new password"
                label="New Password"
                required
                size="small"
                onChange={this.handleChange}
                noValidate
                value={userDetails.Password}
                variant="outlined"
                />
            </Grid>
            <Grid item xs={col6}></Grid>
            <Grid item xs={col6}>
                <TextField
                //fullWidth
                name="confirm password"
                label="Confirm Password"
                required
                size="small"
                onChange={this.handleChange}
                noValidate
                value={userDetails.Password}
                type="password"
                variant="outlined"
                />
                {this.state.errors.password.length > 0 && (
                <span className="error">
                    {this.state.errors.password}
                </span>
                )}
                {this.state.errorMessage === "Incorrect Credentials" && (
                <span className="passError">
                    {this.state.errorMessage}
                </span>
                )}
            </Grid>
            <Grid item xs={col6}></Grid>
            <Grid item xs={col6}>
                <Button
                type="button"
                //fullWidth
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
            </Grid>
            </div>
            }
            </Layout>
        );
    }
}

export default withRouter(withStyles(useStyles)(withMediaQuery('(min-width:600px)')(UserManagement)))