const plugin = require('./core/plugin');
const {
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion,
} = require('./npm-pkg-info');

module.exports = plugin(
  getProjectRoot,
  getProjectName,
  getProjectNameSync,
  getProjectVersion
);
