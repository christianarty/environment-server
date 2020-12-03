const { Router } = require('express');
const stream = require('stream');
const { body, validationResult } = require('express-validator');
const convertObjectToEnvString = require('../objectToEnvString');
const router = Router();

router.get('/', async (req, res) => {
  const envStringBuffer = convertObjectToEnvString({
    type: 'Fiat',
    model: '500',
    color: 'white',
  });
  const fileName = 'sample.env';
  res.set('Content-disposition', 'attachment; filename=' + fileName);
  res.set('Content-Type', 'text/plain');
  res.end(envStringBuffer, 'binary');
});
router.get('/:projectName', (req, res) => {
  const projectName = req.params.projectName;
  res.send('Return a list of environment variables');
});
router.post('/:projectName');

module.exports = router;
