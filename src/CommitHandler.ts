import { DatamineBot } from './DatamineBot';
import getCommitComments from './methods/getCommitComments';
import getCommits from './methods/getCommits';
import parseBuildNumber from './methods/parseBuildNumber';
import { parseMDImage } from './methods/parseImages';
import sendCommit from './methods/sendCommit';
import { Commit } from './models/Commit';
import { Server } from './models/Server';

export default async function CommitHandler($: DatamineBot): Promise<void> {
  const commits = (await getCommits()).data;
  const commitsWithComments = commits.filter(
    commit => commit.commit.comment_count >= 1
  );
  for (const commit of commitsWithComments.reverse()) {
    const buildNumber = parseBuildNumber(commit.commit.message);
    const comments = (await getCommitComments(commit.sha)).data;
    const commentsWithImages = comments.map(comment => ({
      ...comment,
      images: parseMDImage(comment.body),
    }));
    const transformedComments = commentsWithImages.map(comment => ({
      _id: comment.id,
      id: comment.id,
      title: commit.commit.message,
      buildNumber,
      timestamp: comment.created_at,
      url: comment.html_url,
      description: comment.body,
      user: {
        username: comment.user!.login,
        id: comment.user!.id,
        avatarURL: comment.user!.avatar_url,
        url: comment.user!.html_url,
      },
      images: comment.images,
    }));
    const [firstComment, ...subComments] = transformedComments;
    const foundCommit = await Commit.findById(firstComment.id);
    if (!foundCommit) {
      console.log(`Needs to store: ${firstComment.buildNumber}`);
      try {
        const doc = await Commit.create({
          ...firstComment,
          comments: subComments,
        });
        console.log(`Stored Commit ${doc._id} for Build ${doc.buildNumber}`);
        const servers = await Server.find();
        for (const server of servers) {
          await sendCommit($, doc, server);
        }
      } catch (error) {
        console.error(
          `Error storing commit (${firstComment._id}) for build ${firstComment.buildNumber}`,
          (error as Error).stack
        );
      }
    } else {
      console.log(
        `Need to store additional comments for ${foundCommit.buildNumber}`
      );
      try {
        for (const comment of subComments) {
          if (foundCommit._id === comment.id) return;
          if (foundCommit.comments!.find(c => c.id === comment.id)) return;
          await foundCommit.update({
            $push: { comments: comment },
          });
          const servers = await Server.find();
          for (const server of servers) {
            await sendCommit($, comment, server);
          }
        }
      } catch (error) {
        console.error(
          `Error updating commit (${foundCommit._id}) for build ${foundCommit.buildNumber}`,
          (error as Error).stack
        );
      }
    }
  }
}
