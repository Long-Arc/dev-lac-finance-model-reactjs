import React from 'react';
import axios from 'axios';

const EmailSender = () => {
  const handleSendEmail = async () => {
    const data = {
      to: 'dhruvvdhawan@gmail.com',
      subject: 'Test Email',
      text: 'This is a test email.',
      html: '<h1>This is a test email.</h1>',
    };

    try {
      const response = await axios.post('https://dev-api-lacfinance.azurewebsites.net/email/send', data);
      console.log(response.data); // Assuming the backend sends a response message
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div>
      {/* Your other UI elements */}
      <button onClick={handleSendEmail}>Send Email</button>
    </div>
  );
};

export default EmailSender;
