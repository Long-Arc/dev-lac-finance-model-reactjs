import React, { Component } from 'react';
import { Route } from 'react-router';
import Layout from './components/navigation/Layout';
import CashFlowDetails from './pages/cashflow/CashFlowDetails';
import Dashboard from './pages/dashboard/Dashboard';
import FundType from './pages/definitions/FundType';
import PortCo from './pages/definitions/PortCo';
import ShareClass from './pages/definitions/ShareClass';
import UserManagement from './pages/settings/UserManagement';
import CashFlowHistory from './pages/cashflow/CashFlowHistory';
import CreateAccount from './pages/home/ForgotPassword';
import ForgotPassword from './pages/home/ForgotPassword';
import ResetPassword from './pages/home/ResetPassword';

export default class DashboardApp extends Component {
    static displayName = DashboardApp.name;

    render() {
        return (
            <div>
                <div>
                <Route path='/home/cashflowdetails' component={CashFlowDetails} />
                <Route path='/home/usermanagement' component={UserManagement} />
                <Route path='/home/fundtypes' component={FundType} />
                <Route path='/home/portco' component={PortCo} />
                <Route path='/home/shareclass' component={ShareClass} />
                <Route path='/home/dashboard' component={Dashboard} />
                <Route path='/home/resetpassword' component={ResetPassword}></Route>
                <Route path='/home/cashflowhistory' component={CashFlowHistory}></Route>
                <Route path='/home/forgotPassword' component={ForgotPassword}></Route>
                </div>
            </div>    
        );
    }
}
