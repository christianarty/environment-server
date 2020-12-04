const mongoose = require('mongoose');

const EnvironmentSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
    },
    environmentMap: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model('Environments', EnvironmentSchema);
