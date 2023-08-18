import React, { Component } from 'react';
import '../../components/common/Common.css';
import { Button, TextField, Grid, withStyles, Select, MenuItem, useMediaQuery, responsiveFontSizes } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import ActionRenderer from '../../components/common/ActionRenderer';
import CreateIcon from '@material-ui/icons/Create';
import { useStyles } from '../../components/common/useStyles';
import { useState } from 'react';
import { update, reset, get, create, searchById } from '../../api-services/Service';
import { NotificationContainer } from 'react-notifications';
import Layout from '../../components/navigation/Layout';
import axios from 'axios';

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
            userId: null, fullName: null, email: null, mobileNo: null, role: '0', password: null, newpassword: null, confirmnewpassword: null,
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
                { headerName: 'Last Name', field: 'LastName', cellStyle: { 'text-align': "center" } },                
                { headerName: 'Email', field: 'EmailId', cellStyle: { 'text-align': "center" } },
              /*  { headerName: 'Password', field: 'Password', cellStyle: { 'text-align': "center" } },*/
                { headerName: 'Role', field: 'RoleID', cellStyle: { 'text-align': "center" } },
                { headerName: 'Actions', field: 'Actions', sorting: false, filter: false, cellRenderer: null, cellStyle: { 'text-align': "center" } },
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
        if(this.state.fullName && this.state.email && this.state.password) {
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
            const firstName = this.state.fullName.split(' ')[0];
            const lastName = this.state.fullName.split(' ')[1];       
            newUser.UserName = this.state.fullName;
            newUser.Password = this.state.password;
            newUser.FirstName = firstName;
            newUser.LastName = lastName;
            newUser.EmailId = this.state.email;
            newUser.Active = 1;
            newUser.RoleID = 2;
            newUser.DateModified = new Date();
            //newUser.MobileNo = this.state.mobileNo;
            //newUser.Role = this.state.role;
            this.createUser(newUser);
            this.handleSendEmail();
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

    changePass = () => {
        let userId
        let email = sessionStorage.getItem("loggedInUser")
        searchById("/users/getUserByUserName?userName=email", email).then(
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
                    this.loadUsers();
                    }
                );
                this.setState({
                    userDetails: {
                        ...this.state.userDetails,
                        Password: "", // Set it to an empty string to clear the field
                    },
                });
                    } 
        );
    };

    handleSendEmail = async () => {
        const data = {
            to: this.state.email, // Replace with the recipient's email address
            subject: 'LAC Investment Dashboard Account Creation',
            //text: `Hello,\n\nThis is a friendly reminder to change your password soon. Your current password is: ${this.state.password}\n\nPlease log in to your account and update your password as soon as possible.\n\nBest regards,\nYour App Team`,
            html: `
              <h2>Hello ${this.state.fullName},</h2>
              <p>An account has been created using this email id ${this.state.email}</p>
              <p>Your current password is: <strong>${this.state.password}</strong></p>
              <p>This is a friendly reminder to change your password soon.</p>
              <p>Please log in to your account here : https://dev-lacfinance.azurewebsites.net/ and update your password as soon as possible.</p>
              <p>Best regards,<br>Long Arc Capital Team</p>
            `,
          };
    
        try {
          const response = await axios.post('https://dev-api-lacfinance.azurewebsites.net/email/send', data);
          console.log(response.data); // Assuming the backend sends a response message
        } catch (error) {
          console.error('Error sending email:', error);
        }
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
                { sessionStorage.getItem("loggedInRoleId") === "1" ? ( 
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
                                {/* <Grid item xs={col4}>
                                <TextField fullWidth required="true" name="mobileNo" id="txtMobileNo" label="Mobile Number"
                                        onChange={this.handleChange} noValidate value={this.state.mobileNo} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                        {this.state.errors.mobileNo.length > 0 &&
                                        <span className='error'>{this.state.errors.mobileNo}</span>}
                                </Grid> */}
                                <Grid item xs={col4}>
                                <TextField fullWidth required="true" name="password" id="txtPassword" label="Password"
                                        onChange={this.handleChange} noValidate value={this.state.password} 
                                        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
                                        {this.state.errors.password.length > 0 &&
                                        <span className='error'>{this.state.errors.password}</span>}
                                </Grid>
                                {/* <Grid item xs={col4}>
                                <Select fullWidth id="ddlRole" value={this.state.role} className="selectTopMargin"
                                        onChange={ (e)=> this.onRoleChanged(e) }>
                                        <MenuItem value="0">Choose Role</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Sales Officer">Sales Officer</MenuItem>
                                        <MenuItem value="Delivery">Delivery</MenuItem>                                        
                                    </Select>
                                    {this.state.errors.role.length > 0 &&
                                        <span className='error'>{this.state.errors.role}</span>}
                                </Grid> */}
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
                            <div className="ag-theme-alpine" style={{ width: "100%", height: 200, marginTop: 10 }}>
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
                                        domLayout="autoHeight"
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
                            </Grid>
                    </div>
                    )}
            </div> ) :  
            <div>
                {console.log("hi" + sessionStorage.getItem("loggedInRoleId"))}
            <h2 className="header-text-color">User Management</h2>
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