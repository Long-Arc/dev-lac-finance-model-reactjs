import React from 'react';
import axios from 'axios';

const EmailSender = () => {
  const handleSendEmail = async () => {
    const data = {
      to: 'dhruv.dhawan@vearc.com',
      subject: 'Test Email',
      text: 'This is a test email.',
      html: '<h1>This is a test email.</h1>',
    };

    try {
      const response = await axios.post('http://localhost:5000/email/send', data);
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
