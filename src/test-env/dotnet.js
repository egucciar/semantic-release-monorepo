const { outputJson, outputFile } = require('fs-extra');
const { resolve } = require('path');

const { pushAll, setupGit } = require('./common');

const setupDotnetSolution = async () => {
  const gitRoot = await setupGit();

  await outputJson(resolve(gitRoot, '.releaserc.json'), {
    plugins: [
      '@semantic-release/commit-analyzer',
      '@semantic-release/release-notes-generator',
    ],
  });
  await pushAll(gitRoot, 'chore: init solution');

  return gitRoot;
};

const setupDotnetProject = async (gitRoot, projectName) => {
  await outputFile(
    resolve(gitRoot, projectName, `${projectName}.csproj`),
    `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net5.0;netcoreapp3.1</TargetFrameworks>
    <LangVersion>9</LangVersion>
  </PropertyGroup>
  <PropertyGroup>
    <Version>1.0.0</Version>
  </PropertyGroup>
</Project>`
  );
  await pushAll(gitRoot, `chore: init ${projectName}'`);
};

const setupDotnetTestEnv = async (projectNames = []) => {
  const gitRoot = await setupDotnetSolution();

  for (const projectName of projectNames) {
    await setupDotnetProject(gitRoot, projectName);
  }

  return gitRoot;
};

const getDotNetProjectRoot = (gitRoot, projectName) => {
  return resolve(gitRoot, projectName);
};

module.exports = {
  setupDotnetSolution,
  setupDotnetProject,
  setupDotnetTestEnv,
  getDotNetProjectRoot,
};
