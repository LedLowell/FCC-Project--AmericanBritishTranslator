'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  let translatedText;
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      //Get text and locale data from body
      const { text, locale } = req.body;
      //If any is undefined an error will be sent
      if (!locale || text == undefined){
        return res.json({error: 'Required field(s) missing'})
      }
      //If text is empty and error will be sent
      if (text == ''){
        return res.json({error: 'No text to translate'});
      }
      //Switch locale value and translate
      switch(locale){
        case 'american-to-british':
          translatedText = translator.translateToBritish(text);
          return res.json(translatedText);
        case 'british-to-american':
          translatedText = translator.translateToAmerican(text);
          return res.json(translatedText);
        default:
          return res.json({error: 'Invalid value for locale field'});
      }
    });
};
