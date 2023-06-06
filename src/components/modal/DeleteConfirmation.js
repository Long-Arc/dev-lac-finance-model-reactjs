import React, { useState, useEffect } from 'react';
import {
    DialogContent, IconButton, Grid, Dialog, DialogActions, Button,
    useMediaQuery, makeStyles, Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    customButtonPrimary: {
        borderRadius: '8px',
        fontWeight: 500,
        color: "#f9f9f9",
        backgroundColor: "#702492",
        "&:hover": {
            backgroundColor: "#702492"
        },
        "&:disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.12)"
        },
        textTransform: 'none',
        fontFamily: 'poppins',
        paddingLeft: 15,
        paddingRight: 15,
    },
    customButtonSecondary: {
        borderRadius: '8px',
        fontWeight: 500,
        color: "#f9f9f9",
        backgroundColor: "#e64226",
        "&:hover": {
            backgroundColor: "#e64226"
        },
        "&:disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.12)"
        },
        textTransform: 'none',
        fontFamily: 'poppins',
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: 'poppins',
        marginBottom: 20,
        fontWeight: 700,
        color: '#000000',
    },
    subHeader: {
        fontSize: 15,
        fontFamily: 'raleway',
        fontWeight: 500,
        color: '#000000',
    }
}));

export default function DeleteConfirmation(props) {
    const matches = useMediaQuery('(min-width:600px)');
    const classes = useStyles();

    return (
        <React.Fragment>
            <Dialog
                fullWidth
                open={props.showConfirm}
                onClose={props.handleConfirmClose}
                disableBackdropClick
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Grid container spacing={0}>
                        <Grid item xs={matches ? 11 : 10}>
                            <Typography className={classes.title}>
                                Delete this record?
                            </Typography>
                            <Typography className={classes.subHeader}>
                                This action will delete the record. We cannot recover this record later.
                            </Typography>
                            <Typography className={classes.subHeader}>
                                Are you sure you want to <span style={{ color: '#c2272d' }}>permanently delete</span> this record?
                            </Typography>
                        </Grid>
                        <Grid item xs={matches ? 1 : 2}>
                            <IconButton style={{ marginLeft: '22px', marginTop: '-20px' }} onClick={props.handleConfirmClose}
                                aria-label="settings">
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleConfirmClose} color="primary" className={classes.customButtonSecondary} size="medium">
                        Cancel
                    </Button>
                    <Button onClick={props.deleteRecord} color="primary" className={classes.customButtonPrimary} size="medium">
                        Yes, delete it
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}