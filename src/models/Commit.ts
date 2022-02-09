import { model, Schema } from 'mongoose';

interface CommitUser {
  username: string;
  id: number;
  avatarURL: string;
  url: string;
}

export interface Commit {
  _id: number;
  id?: number;
  buildNumber: string;
  title: string;
  description: string;
  url: string;
  images: string[];
  user: CommitUser;
  comments?: Commit[];
  timestamp: string;
}

const CommitSchema = new Schema<Commit>({
  _id: {
    type: Number,
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: false,
  },
  user: {
    username: { type: String, required: true },
    id: { type: Number, required: true },
    avatarURL: { type: String, required: true },
    url: { type: String, required: true },
  },
  comments: {
    type: Array,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

export const Commit = model<Commit>('Commits', CommitSchema);
