const express = require('express');
const axios = require('axios');
const twilio = require('twilio');

const app = express();
const PORT = process.env.PORT || 3000;

// Twilio credentials
const accountSid = 'AC09d1e3809df0c114e5336559b621bc8c';
const authToken = 'c4c4bbd0434b4b7ab5731d6dcb442116';
const client = twilio(accountSid, authToken);

app.get('/welcome', (req, res) => {
    res.json({ message: 'Hello from Render!', status: 'success' });
});

app.get('/getDueStatus/:id', async (req, res) => {
  const id = req.params.id;
  const url = `https://arduino-db-8ae74-default-rtdb.firebaseio.com/students/${id}.json`;

  try {
    const response = await axios.get(url);
    const student = response.data;
    if (student){
      console.log(`fetched student fees data with reg-number : ${id} successfully`);
    }else{
       console.error(`unable to fetch student fees data with reg-number : ${id}`);
    }
    const whatsappNumber = `whatsapp:+917059252457`;
    let messageBody = "";
    if(student.hasDues){
      messageBody = `Hello! ${student.name} bearing Roll Number ${id} . You have Rs ${student.amount}/- pending. Please clear them soon!! - Admin`;
    }else{
      messageBody = `Hello! ${student.name} bearing Roll Number ${id} . You have dont have any pending dues - Admin`;
    }
    const msg = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: whatsappNumber,
      body: messageBody
    });
    res.json({ message: 'WhatsApp message for pending dues(if any) sent successfully',
      sid: msg.sid,
      status: 'success'
     });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch data',
      error: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
