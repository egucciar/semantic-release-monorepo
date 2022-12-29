const readPkg = require('read-pkg');

const getPackageInfo = async () => ({
  name: process.env.SEMANTIC_RELEASE_PACKAGE || (await readPkg()).name,
});

const getPackageInfoSync = () => ({
  name: process.env.SEMANTIC_RELEASE_PACKAGE || readPkg.sync().name,
});

module.exports = {
  getPackageInfo,
  getPackageInfoSync,
};
