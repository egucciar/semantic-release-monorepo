const { getPackageInfo } = require('./package-info')

module.exports = async version => {
  if (!version) {
    return null;
  }

  const name = (await getPackageInfo()).name;
  return `${name}-v${version}`;
};
