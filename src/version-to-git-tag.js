import readPkg from 'read-pkg';

export default async function(version) {
  if (!version) {
    return null;
  }

  const { name } = await readPkg();
  return `${name}-v${version}`;
}
