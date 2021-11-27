import { gh, OwnerPlusRepo } from '../Github';

export default function getCommits(): ReturnType<
  typeof gh.rest.repos.listCommits
> {
  return gh.rest.repos.listCommits(OwnerPlusRepo);
}
