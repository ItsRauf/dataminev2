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
        username: comment.user?.login,
        id: comment.user?.id,
        avatarURL: comment.user?.avatar_url,
        url: comment.user?.html_url,
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
    }
  }
  // const shas = commits.data
  //   .filter(c => c.commit.comment_count >= 1)
  //   .map(c => c.sha);
  // const comments = await Promise.all(shas.map(sha => getCommitComments(sha)));
  // const commentsData = comments
  //   .map(c => c.data)
  //   .reverse()
  //   .flat();
  // const parsedComments = commentsData.map(c => ({
  //   user: c.user,
  //   body: c.body,
  //   url: c.html_url,
  //   id: c.id,
  // }));
  // console.log(parsedComments);
}
