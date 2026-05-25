import simpleGit from "simple-git";

const git = simpleGit();

export async function isGitAvailable() {
  try {
    await git.version();
    const isRepo = await git.checkIsRepo();
    return isRepo;
  } catch {
    return false;
  }
}

export async function getCurrentBranch() {
  try {
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      return null;
    }
    const branchName = await git.revparse([
      "--abbrev-ref",
      "HEAD"
    ]);
    return branchName.trim();
  } catch {
    return null;
  }
}
