import { gh, OwnerPlusRepo } from '../Github';

export default function getCommitComments(
  commit_sha: string
): ReturnType<typeof gh.rest.repos.listCommentsForCommit> {
  return gh.rest.repos.listCommentsForCommit({
    ...OwnerPlusRepo,
    commit_sha,
  });
}
