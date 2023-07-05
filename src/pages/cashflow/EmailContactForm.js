import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import Grid from '@material-ui/core';

const EmailContactForm = () => {
 const form = useRef();

 const sendEmail = (e) => {
   e.preventDefault(); // prevents the page from reloading when you hit “Send”

   emailjs.sendForm('service_b1vg9g9', 'template_aa8zima', form.current, 'qIJWh7IcRImG3KJS-')
     .then((result) => {
         // show the user a success message
     }, (error) => {
         // show the user an error
     });

     form.current.reset();
 };

 return (
    <div>
   <form ref={form} onSubmit={sendEmail}>
     <TextField fullWidth required="true" name="user_name" id="txtFullName" label="Full Name"
        //onChange={this.handleChange} noValidate value={this.state.fullName}
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }} m/>
     <TextField fullWidth required="true" name="user_email" id="txtEmail" label="Email Address"
        //onChange={this.handleChange} noValidate value={this.state.email} 
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
     <TextField fullWidth required="true" name="password" id="txtPassword" label="Password"
        //onChange={this.handleChange} noValidate value={this.state.password} 
        InputLabelProps={{ shrink: true, style: { fontSize: 18 } }}/>
     <input type="submit" value="Send" />
   </form>
   </div>
 );
};

export default EmailContactForm;