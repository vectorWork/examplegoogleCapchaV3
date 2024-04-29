const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const path = require('path');
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
// Cambia 'TU-CLAVE-SECRETA' por tu clave secreta
const RECAPTCHA_V3_SECRET_KEY = process.env.RECAPTCHA_V3_SECRET_KEY;

app.post('/form-post', async (req, res) => {
  const token = req.body.token;
  const action = req.body.action;

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: RECAPTCHA_V3_SECRET_KEY,
          response: token,
        },
      }
    );

    const arrResponse = response.data;
    console.log(arrResponse);
    // verificar la respuesta
    if (
      arrResponse.success == '1' &&
      arrResponse.action == action &&
      arrResponse.score >= 0.5
    ) {
      // Si entra aqui, es un humano, puedes procesar el formulario
      res.send('ok!, eres un humano');
    } else {
      // Si entra aqui, es un robot....
      res.send('Lo siento, parece que eres un Robot');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al verificar reCAPTCHA');
  }
});

app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
