const readPkg = require('read-pkg');

module.exports = async (version, separator = '-') => {
  if (!version) {
    return null;
  }
  const { name } = await readPkg();
  return `${name}${separator}v${version}`;
};
