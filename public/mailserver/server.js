const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

// Handle the POST request to send the forgot password email
app.post('/api/forgot-password', (req, res) => {
  const email = req.body.email;

  // Configure your email service provider
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: 'lindasandryani@gmail.com',
      pass: 'Udahganti77'
    }
  });

  const mailOptions = {
    from: 'lindasandryani@gmail.com',
    to: email,
    subject: 'Reset Password',
    text: 'Please reset your password by clicking on the following link...'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Failed to send forgot password email.');
    } else {
      console.log('Forgot password email sent:', info.response);
      res.sendStatus(200);
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
