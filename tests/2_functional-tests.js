const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');
const text = 'Mangoes are my favorite fruit.';
const translatedText = 'Mangoes are my <span class="highlight">favourite</span> fruit.'
const nonTranslatioText = 'This text does not need translation';
const locale = 'american-to-british';

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    test('Translation with text and locale fields: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                text: text,
                locale: locale
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.translation, translatedText);
                done();
            });
    });
    test('Translation with text and invalid locale field: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                text: text,
                locale: 'invalid'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });
    test('Translation with missing text field: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                locale: locale
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
    });
    test('Translation with missing locale field: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                text: text
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            })
    });
    test('Translation with empty text: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                text: '',
                locale: locale
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });
    test('Translation with text that needs no translation: POST request to /api/translate', done => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({
                text: nonTranslatioText,
                locale: locale
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            })
    });
});
