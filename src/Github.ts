import { config } from 'dotenv';
config();

import { Octokit } from 'octokit';

export const gh = new Octokit({
  auth: process.env.ghAccessToken,
  userAgent: 'DatamineBot/v1.0.0-slash',
});

export const OwnerPlusRepo = {
  owner: 'Discord-Datamining',
  repo: 'Discord-Datamining',
};
