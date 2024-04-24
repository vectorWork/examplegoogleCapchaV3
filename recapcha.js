require('dotenv').config();
const RECAPTCHA_V3_PUBLIC_KEY = process.env.RECAPTCHA_V3_PUBLIC_KEY;

$('#form').submit(function (event) {
  event.preventDefault();
  /*Cambia 6LcZu9QUAAAAACaj-WBiVIQUlr94vfCC8DUpIanS por tu clave de sitio web*/
  grecaptcha.ready(function () {
    grecaptcha
      .execute(RECAPTCHA_V3_PUBLIC_KEY, {
        action: 'registro',
      })
      .then(function (token) {
        $('#form').prepend(
          '<input type="hidden" name="token" value="' + token + '">'
        );
        $('#form').prepend(
          '<input type="hidden" name="action" value="registro">'
        );
        $('#form').unbind('submit').submit();
      });
  });
});
