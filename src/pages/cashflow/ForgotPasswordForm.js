import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { TextField, Button, Grid } from '@material-ui/core';
import { Router } from 'react-router-dom/cjs/react-router-dom.min';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = theme => ({
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
    },
});



const ForgotPasswordForm = () => {
 const form = useRef();
 const classes = useStyles();
 const [otp, SetOtp] = useState(true);
 const history = useHistory();
 const [actionText, setActionText] = useState('Request Verification Code');
 const sendEmail = (e) => {
  let check = 0;
  if (otp) {
   e.preventDefault(); // prevents the page from reloading when you hit “Send”
    form.current.elements.code.value = generateRandomToken(8);
    console.log(form.current.elements.code.value)
    check = form.current.elements.code.value;
    console.log(check);
    // emailjs.sendForm('service_b1vg9g9', 'template_5f59bru', form.current, 'qIJWh7IcRImG3KJS-')
    //   .then((result) => {
    //       // show the user a success message
    //   }, (error) => {
    //       // show the user an error
    //   });
    SetOtp(false);
    setActionText('Submit Otp')
  } else {
      console.log(check)
      console.log(form.current.elements.otp.value)
      if (form.current.elements.code.value === form.current.elements.otp.value) {
        // history.push('/home/resetpassword')
        const userEmail = form.current.elements.user_email.value;

        history.push(`/home/resetpassword?user_email=${userEmail}`);
      } else {
        
      }
  }
 };

 const generateRandomToken = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
  
    return token;
  };

 return (
    <div>
      <Grid container spacing={2}>
   <form ref={form} onSubmit={sendEmail}>
   <Grid item xs={12}>
     <TextField fullWidth required="true" size="small" name="user_email" id="txtEmail" label="Email Address"
        disabled={!otp} variant="outlined"/>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
        <TextField fullWidth required="true" size="small" name="otp" id="text" label="OTP"
        disabled={otp} variant="outlined"/>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={12}>
     <Button type="submit" className={classes.customButtonPrimary} value="Send"> {actionText} </Button>
     <input type="hidden" name="code" />
     </Grid>
   </form>
   </Grid>
   </div>
 );
};

export default ForgotPasswordForm;