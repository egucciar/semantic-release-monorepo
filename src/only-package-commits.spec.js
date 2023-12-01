import { gitCommitsWithFiles, initGitRepo } from './git-utils.js';
import { onlyPackageCommits, withFiles } from './only-package-commits.js';
import path from 'path';
import { describe, it, expect } from 'vitest';
async function getCommitWithFileFromMessage(commits, message) {
  const commitsWithFiles = await withFiles(
    Array.of(commits.find(obj => obj.subject === message))
  );
  if (commitsWithFiles.length !== 0) {
    return commitsWithFiles[0];
  } else {
    return null;
  }
}

describe('filter commits', () => {
  it('should filter 0 commits (no root folder support) ', async () => {
    const gitRepo = await initGitRepo(false);
    const commitsToCreate = [
      { message: 'init1', files: [{ name: 'package.json' }] },
      { message: 'message1', files: [{ name: 'readme.md' }] },
      { message: 'message2', files: [{ name: 'module1/readme.md' }] },
      {
        message: 'message3',
        files: [{ name: 'readme1.md' }, { name: 'module1/readme2.md' }],
      },
    ];
    process.chdir(gitRepo.cwd);
    const commits = await gitCommitsWithFiles(commitsToCreate);
    const result = await onlyPackageCommits(commits);
    expect(result).toHaveLength(0);
  });

  it('should filter 3 commits (folder module1) ', async () => {
    const gitRepo = await initGitRepo(false);
    const commitsToCreate = [
      {
        message: 'init1',
        files: [{ name: 'package.json' }, { name: 'module1/package.json' }],
      },
      { message: 'message1', files: [{ name: 'readme.md' }] },
      { message: 'message2', files: [{ name: 'module1/readme.md' }] },
      {
        message: 'message3',
        files: [{ name: 'readme1.md' }, { name: 'module1/readme2.md' }],
      },
    ];
    process.chdir(gitRepo.cwd);
    const commits = await gitCommitsWithFiles(commitsToCreate);
    process.chdir(path.join(gitRepo.cwd, 'module1'));
    const result = await onlyPackageCommits(commits);

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(
      await getCommitWithFileFromMessage(commits, 'init1')
    );
    expect(result).not.toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message1')
    );
    expect(result).toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message2')
    );
    expect(result).toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message3')
    );
  });

  it('should filter 2 commits (folder module2) ', async () => {
    const gitRepo = await initGitRepo(false);
    const commitsToCreate = [
      {
        message: 'init1',
        files: [{ name: 'package.json' }, { name: 'module1/package.json' }],
      },
      {
        message: 'message1',
        files: [{ name: 'readme.md' }, { name: 'module2/package.json' }],
      },
      { message: 'message2', files: [{ name: 'module1/readme.md' }] },
      {
        message: 'message3',
        files: [
          { name: 'readme1.md' },
          { name: 'module1/readme2.md' },
          { name: 'module2/readme.md' },
        ],
      },
    ];
    process.chdir(gitRepo.cwd);
    const commits = await gitCommitsWithFiles(commitsToCreate);
    process.chdir(path.join(gitRepo.cwd, 'module2'));
    const result = await onlyPackageCommits(commits);

    expect(result).toHaveLength(2);
    expect(result).not.toContainEqual(
      await getCommitWithFileFromMessage(commits, 'init1')
    );
    expect(result).toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message1')
    );
    expect(result).not.toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message2')
    );
    expect(result).toContainEqual(
      await getCommitWithFileFromMessage(commits, 'message3')
    );
  });
});
