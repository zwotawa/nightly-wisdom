const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const TO_EMAIL = process.env.TO_EMAIL || SMTP_USER;
  const FORM_ENDPOINT = process.env.FORM_ENDPOINT;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !TO_EMAIL) {
    if (!FORM_ENDPOINT) {
      res.status(501).json({ message: 'Email not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL or FORM_ENDPOINT in environment.' });
      return;
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Formspree error', response.status, errorBody);
        throw new Error('Form endpoint error');
      }

      res.status(200).json({ message: 'Message sent' });
      return;
    } catch (err) {
      console.error('send-email form fallback error', err);
      res.status(500).json({ message: 'Failed to send form submission' });
      return;
    }
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_PORT === '465',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const mail = {
      from: `${name} <${email}>`,
      to: TO_EMAIL,
      subject: `Website contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\nMessage:\n${message}`
    };

    await transporter.sendMail(mail);

    res.status(200).json({ message: 'Message sent' });
  } catch (err) {
    console.error('send-email error', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
};
