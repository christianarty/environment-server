const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const dotenv = require('dotenv');
const convertObjectToEnvString = require('../objectToEnvString');
const EnvModel = require('./env.model');
const { jsonToMap, duplicateKeyError } = require('../utils');

const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const router = Router();

/**
 * @route GET env/
 * @description Retrieve all the available projects
 * @access Public
 *
 */
router.get('/', async (req, res) => {
  const listOfEnvs = await EnvModel.find().lean();
  const listOfEnvProjNames = listOfEnvs.map((env) => env.projectName);
  res.status(200).send({ availableProjectNames: listOfEnvProjNames });
});

/**
 * @route GET env/${projectName}
 * @description Retrieve environment details about an available project
 * @access Public
 *
 */

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
/**
 * @route GET env/${projectName}/download
 * @description Retrieve environment details about an available project as an .env file
 * @access Public
 *
 */
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

/**
 * @route POST env/${projectName}
 * @description Create a new projectName with environment variables
 * @access Public
 *
 */

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
      duplicateKeyError();
      return res.status(500).send('Internal Server Error');
    }
  },
);
/**
 * @route POST env/${projectName}/upload
 * @description Create a new projectName with environment variables using a .env file
 * @access Public
 *
 */

router.post(
  '/:projectName/upload',
  param('projectName').isString(),
  upload.single('uploadedEnv'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const { projectName } = req.params;
    const { buffer } = req.file;
    const environmentMap = dotenv.parse(buffer);

    try {
      await EnvModel.create({
        projectName,
        environmentMap,
      });
      return res.status(201).send(`${projectName} created successfully`);
    } catch (error) {
      console.error(error.code);
      return res.status(500).send('Internal Server Error');
    }
  },
);

/**
 * @route PUT env/${projectName}
 * @description Update an existing projectName with environment variables
 * @access Public
 *
 */
router.put(
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
    try {
      const foundEnv = await EnvModel.findOne({ projectName });
      if (!foundEnv) {
        return res
          .status(404)
          .send(`No found env for project Name: ${projectName}`);
      }
      const environmentMap = foundEnv.get('environmentMap');
      const responseInputMap = jsonToMap(environment);
      const mergedMap = new Map([...environmentMap, ...responseInputMap]);
      await foundEnv.updateOne({
        environmentMap: mergedMap,
      });

      return res
        .status(200)
        .send(`${projectName} has been successfully updated `);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  },
);

/**
 * @route DELETE env/${projectName}
 * @description Delete an existing projectName with environment variables
 * @access Public
 *
 */
router.delete(
  '/:projectName',
  param('projectName').isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    const { projectName } = req.params;

    try {
      const foundEnv = await EnvModel.findOneAndDelete({ projectName });
      if (!foundEnv) {
        return res
          .status(404)
          .send(`No found env for project Name: ${projectName}`);
      }
      return res.status(200).send({ deletedEnvironment: foundEnv });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error });
    }
  },
);

module.exports = router;
