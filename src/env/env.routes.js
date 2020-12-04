const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const convertObjectToEnvString = require('../objectToEnvString');
const EnvModel = require('./env.model');
const { jsonToMap } = require('../utils');

const router = Router();

router.get('/', async (req, res) => {
  res.send('WIP');
});

router.get('/:projectName', async (req, res) => {
  const { projectName } = req.params;
  try {
    const foundEnv = await EnvModel.findOne({ projectName })
      .select('projectName environmentMap')
      .lean();
    if (!foundEnv) {
      return res
        .status(404)
        .send(`No env found with the projectName: ${projectName}`);
    }
    return res.status(200).send(foundEnv);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.get('/:projectName/download', async (req, res) => {
  const { projectName } = req.params;
  try {
    const foundEnv = await EnvModel.findOne({ projectName })
      .select('projectName environmentMap')
      .lean();
    if (!foundEnv) {
      return res
        .status(404)
        .send(`No env found with the projectName: ${projectName}`);
    }
    const envStringBuffer = convertObjectToEnvString({
      ...foundEnv.environmentMap,
    });
    const fileName = `${foundEnv.projectName}.env`;
    res.set('Content-disposition', `attachment; filename=${fileName}`);
    res.set('Content-Type', 'text/plain');
    res.end(envStringBuffer, 'binary');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});

router.post(
  '/:projectName',
  body('environment').exists(),
  param('projectName').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const { projectName } = req.params;
    const { environment } = req.body;
    const environmentMap = jsonToMap(environment);
    try {
      await EnvModel.create({
        projectName,
        environmentMap,
      });
      return res.status(201).send(`${projectName} created successfully`);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  },
);

module.exports = router;
