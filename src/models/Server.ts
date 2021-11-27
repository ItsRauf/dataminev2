import { Schema, model, Document } from 'mongoose';

export interface Server {
  _id: string;
  channel: string;
  role?: string;
  modrole: string;
  lastSentComment?: number;
}

export type ServerDoc = Server & Document<unknown, unknown, Server>;

const ServerSchema = new Schema<Server>({
  _id: { type: String, required: true },
  channel: { type: String, required: true },
  role: String,
  modrole: { type: String, required: true },
  lastSentComment: Number,
});

export const Server = model<Server>('Servers', ServerSchema);
