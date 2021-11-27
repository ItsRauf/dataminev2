import { Commit } from '../models/Commit';

export default function getLatestCommit(): ReturnType<typeof Commit.find> {
  return Commit.find().sort({ _id: -1 }).limit(1);
}
