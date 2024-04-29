const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
require('dotenv').config();

// Cambia 'TU-CLAVE-SECRETA' por tu clave secreta
const RECAPTCHA_V3_SECRET_KEY = process.env.RECAPTCHA_V3_SECRET_KEY;

// app.post('/form-post', async (req, res) => {
//   const token = req.body.token;
//   const action = req.body.action;

//   try {
//     const response = await axios.post(
//       'https://www.google.com/recaptcha/api/siteverify',
//       null,
//       {
//         params: {
//           secret: RECAPTCHA_V3_SECRET_KEY,
//           response: token,
//         },
//       }
//     );

//     const arrResponse = response.data;

//     // verificar la respuesta
//     if (
//       arrResponse.success == '1' &&
//       arrResponse.action == action &&
//       arrResponse.score >= 0.5
//     ) {
//       // Si entra aqui, es un humano, puedes procesar el formulario
//       res.send('ok!, eres un humano');
//     } else {
//       // Si entra aqui, es un robot....
//       res.send('Lo siento, parece que eres un Robot');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error al verificar reCAPTCHA');
//   }
// });

// app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));

// Ruta para manejar la validación del formulario
app.post('/form-post', async (req, res) => {
  try {
    const { fname, lname, email, message, recaptchaResponse } = req.body;

    // Verificar si todos los campos requeridos están completos
    if (fname && lname && email && message) {
      // Hacer la solicitud al servidor de reCAPTCHA
      const recaptchaUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const recaptchaResponseData = await axios.post(recaptchaUrl, null, {
        params: {
          secret: RECAPTCHA_V3_SECRET_KEY,
          response: recaptchaResponse,
        },
      });

      const recaptchaResult = recaptchaResponseData.data;

      if (
        recaptchaResult.success &&
        recaptchaResult.score >= 0.5 &&
        recaptchaResult.action === 'contact'
      ) {
        // Realizar la lógica para enviar el correo electrónico (o cualquier otra acción)
        const successMessage = 'Tu mensaje se envió correctamente.';
        res.status(200).json({ success: true, message: successMessage });
      } else {
        const errorMessage =
          'Algo salió mal. Por favor, inténtalo de nuevo más tarde.';
        res.status(400).json({ success: false, message: errorMessage });
      }
    } else {
      const errorMessage = 'Por favor, completa todos los campos requeridos.';
      res.status(400).json({ success: false, message: errorMessage });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error interno del servidor.' });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
