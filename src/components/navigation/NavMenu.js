import React, { Component } from 'react';
import clsx from 'clsx';
import {
    Button, AppBar, withStyles, Toolbar, List, CssBaseline, Typography, IconButton,
    ListItem, ListItemText, Drawer, Tooltip, useMediaQuery, Collapse, Divider
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import '../../components/common/Common.css'
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import SettingsIcon from '@material-ui/icons/SupervisorAccount';
import StoreIcon from '@material-ui/icons/Store';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import ClassIcon from '@material-ui/icons/Class';
import AppsIcon from '@material-ui/icons/Apps';
import LACLogo from "../../assets/LACLogo2.png";

const drawerWidth = 240;

const useStyles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'white',
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        left: 0,
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: 500,
        }),
    },
    drawerOpen: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: 500,
        }),
        width: drawerWidth,
        backgroundColor: 'white',
    },
    drawerShow: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: 500,
        }),
        width: drawerWidth,
        backgroundColor: 'white',
        position: 'fixed',
        left: '0px',
        zIndex: 100,
    },
    drawerClose: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: 500,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8) + 0,
        },
        backgroundColor: 'white',
    },
    drawerHide: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.sharp,
            duration: 500,
        }),
        overflowX: 'hidden',
        //width: theme.spacing(),
        // [theme.breakpoints.up('sm')]: {
        //     width: theme.spacing(8) + 0,
        // },
        backgroundColor: 'white',
        position: 'fixed',
        left: '-240px',
        zIndex: 100,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        marginTop: 50,
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
    drawerMenu: {
        textAlign: 'center',
        width: 89,
    },
    iconColor: {
        color: '#702492'
    },
    textColor: {
        color: '#702492',
        fontFamily: 'poppins',
    },
    btnText: {
        fontSize: 14,
        color: '#702492',
        fontFamily: 'poppins',
        textTransform: 'none',
    }
});

const withMediaQuery = (...args) => Component => props => {
    const mediaQuery = useMediaQuery(...args);
    return <Component mediaQuery={mediaQuery} {...props} />;
};

class NavMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            currentStatus: '',
        };
    }

    handleDrawerOpen = () => {
        this.setState({ open: true })
    };
    handleDrawerClose = () => {
        this.setState({ open: false })
    };

    logOut = (event) => {
        event.preventDefault();
        sessionStorage.setItem('loggedInUser', '');
        const { history } = this.props;
        if (history) history.push('/Home');
    }

    hideNavBar() {
        console.log(this.state.open)
        if (window.innerWidth <= 600) {
            this.setState({ open: true });
        }
    }

    redirectToCashFlowDetails = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/cashflowdetails');
    }

    redirectToFundTypes = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/fundtypes');
    }

    redirectToPortCo = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/portco');
    }

    redirectToShareClass = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/shareclass');
    }

    redirectToUserManagement = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/usermanagement');
    }

    redirectToDashboard = (event) => {
        event.preventDefault();
        this.hideNavBar();
        const { history } = this.props;
        if (history) history.push('/home/dashboard');
    }

    render() {
        const { classes, mediaQuery } = this.props;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        {!mediaQuery &&
                            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={this.handleDrawerClose}
                                className={classes.iconColor}> <MenuIcon />
                            </IconButton>}
                        <img src={LACLogo} height={50} alt="Logo" />
                        <Typography variant="h6" className={classes.alignment}>
                        </Typography>
                        <div>
                            <Button color="primary" className={classes.btnText} onClick={this.redirectToDashboard}>
                                <AppsIcon className={classes.leftIcon} />
                                Dashboard
                            </Button>

                            {mediaQuery &&
                                <IconButton aria-label="account of current user" aria-controls="menu-appbar"
                                    aria-haspopup="true" onClick={this.handleMenu} color="inherit">
                                    <AccountCircle className={classes.iconColor} />
                                </IconButton>}

                            {mediaQuery &&
                                <span className={classes.textColor}>{sessionStorage.getItem('loggedInUser')}</span>}
                            {mediaQuery &&
                                <Button color="primary" className={classes.btnText} onClick={this.logOut}>
                                    <PowerSettingsNewIcon className={classes.leftIcon} />
                                    Logout
                                </Button>}
                        </div>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    className=
                    {mediaQuery ?
                        clsx(classes.drawer, {
                            [classes.drawerOpen]: this.state.open,
                            [classes.drawerClose]: !this.state.open,
                        }) :
                        clsx(classes.drawer, {
                            [classes.drawerShow]: !this.state.open,
                            [classes.drawerHide]: this.state.open,
                        })
                    }
                    classes=
                    {mediaQuery ?
                        {
                            paper: clsx({
                                [classes.drawerOpen]: this.state.open,
                                [classes.drawerClose]: !this.state.open,
                            }),
                        } :
                        {
                            paper: clsx({
                                [classes.drawerShow]: !this.state.open,
                                [classes.drawerHide]: this.state.open,
                            }),
                        }
                    } >

                    <div className={classes.toolbar}>
                        {this.state.open ?
                            <IconButton onClick={this.handleDrawerClose}>
                                < ChevronLeftIcon className="drawerItems" />
                            </IconButton> : <IconButton onClick={this.handleDrawerOpen}>
                                < MenuIcon className="drawerItems" />
                            </IconButton>}
                    </div>
                    <List style={{ marginLeft: 5 }}>

                        {/* Products Management */}
                        <ListItem button onClick={this.redirectToPortCo}>
                            <Tooltip title="PortCo">
                                <StoreIcon className="drawerItems" />
                            </Tooltip>
                            <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>PortCo</span></ListItemText>
                        </ListItem>

                        {/* Products Management */}
                        <ListItem button onClick={this.redirectToFundTypes}>
                            <Tooltip title="Fund Types">
                                <MergeTypeIcon className="drawerItems" />
                            </Tooltip>
                            <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>Fund Types</span></ListItemText>
                        </ListItem>

                        {/* Products Management */}
                        <ListItem button onClick={this.redirectToShareClass}>
                            <Tooltip title="Share Class">
                                <ClassIcon className="drawerItems" />
                            </Tooltip>
                            <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>Share Class</span></ListItemText>
                        </ListItem>

                        {/* Products Management */}
                        <ListItem button onClick={this.redirectToCashFlowDetails}>
                            <Tooltip title="Cash Flow Details">
                                <BubbleChartIcon className="drawerItems" />
                            </Tooltip>
                            <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>Cash Flow Details</span></ListItemText>
                        </ListItem>

                        {/* Configurations */}
                        <ListItem button onClick={this.redirectToUserManagement}>
                            <Tooltip title="User Management">
                                <SettingsIcon className="drawerItems" />
                            </Tooltip>
                            <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>User Management</span></ListItemText>
                        </ListItem>

                        {!mediaQuery &&
                            <ListItem button onClick={this.logOut}>
                                <Tooltip title="Logout">
                                    <PowerSettingsNewIcon className="drawerItems" />
                                </Tooltip>
                                <ListItemText className="drawerItemsText"><span style={{ fontFamily: 'poppins' }}>Logout</span></ListItemText>
                            </ListItem>}
                    </List>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(withStyles(useStyles)(withMediaQuery('(min-width:600px)')(NavMenu)))