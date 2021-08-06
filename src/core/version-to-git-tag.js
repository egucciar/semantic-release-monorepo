module.exports = getProjectName => async version => {
  if (!version) {
    return null;
  }

  const name = await getProjectName();
  return `${name}-v${version}`;
};
