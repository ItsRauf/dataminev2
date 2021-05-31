const axios = require("axios").default;
const Commit = require("./models/Commit");
const sendSingleComment = require("./sendSingleComment");
const DatamineBot = require("./bot");

/**
 * Parses Discord Build Number from Commit Title
 *
 * @param {string} title
 */
function parseBuildNumber(title) {
  const regex = /(Canary\sbuild:\s([0-9]*))/;
  return regex.exec(title)[2];
}

const RequestOptions = {
  auth: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
};

async function getCommitsWithComments() {
  /** @type {{data: any[]}} */
  const { data } = await axios.get(
    "https://api.github.com/repos/Discord-Datamining/Discord-Datamining/commits",
    RequestOptions
  );

  return data
    .filter((commit) => commit.commit.comment_count >= 1)
    .map((commit) => {
      return {
        ...commit,
        commit: {
          ...commit.commit,
          buildNumber: parseBuildNumber(commit.commit.message),
        },
      };
    })
    .sort((a, b) => a.commit.buildNumber - b.commit.buildNumber);
}

/** @return {{old: string, new: string}[]} */
function parseImagesFromComment(comment) {
  const images = [];
  const markdownImageRegexs = [
    /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/gm,
    /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m,
  ];
  const markdownImages = comment.body.match(markdownImageRegexs[0]);
  const htmlImageRegexs = [
    /<img\s+[^>]*src="([^"]*)"[^>]*>/gm,
    /<img\s+[^>]*src="([^"]*)"[^>]*>/m,
  ];
  const htmlImages = comment.body.match(htmlImageRegexs[0]);
  if (Array.isArray(markdownImages)) {
    images.push(
      ...markdownImages.map((image) => ({
        old: image,
        new: markdownImageRegexs[1].exec(image)[1],
      }))
    );
  }
  if (Array.isArray(htmlImages)) {
    images.push(
      ...htmlImages.map((image) => ({
        old: image,
        new: htmlImageRegexs[1].exec(image)[1],
      }))
    );
  }
  return images;
}

/** @return {[any, any[]]} */
async function getCommentsWithImagesOfCommit(commit) {
  /** @type {{data: any[]}} */
  const { data } = await axios.get(commit.comments_url, RequestOptions);
  return [
    commit.commit,
    data.map((comment) => {
      const images = parseImagesFromComment(comment);
      images.forEach((image) => {
        comment.body = comment.body.replace(image.old, "");
      });
      return {
        ...comment,
        images,
      };
    }),
  ];
}

function transformCommentDataShape(comment, { title, buildNumber }) {
  return {
    _id: comment.id,
    id: comment.id,
    title,
    buildNumber,
    timestamp: comment.created_at,
    url: comment.html_url,
    description: comment.body,
    user: {
      username: comment.user.login,
      id: comment.user.id,
      avatarURL: comment.user.avatar_url,
      url: comment.user.html_url,
    },
    images: comment.images.map((image) => image.new),
  };
}

module.exports = async function commitHandler() {
  const commits = await getCommitsWithComments();
  console.log(commits);
  for await (const [commit, comments] of commits.map(
    getCommentsWithImagesOfCommit
  )) {
    const [firstComment, ...subComments] = comments.map((comment) =>
      transformCommentDataShape(comment, {
        title: commit.message,
        buildNumber: commit.buildNumber,
      })
    );
    // console.log("firstComment", firstComment);
    const foundCommit = await Commit.findById(firstComment.id);
    // console.log("foundCommit", foundCommit._id);
    if (!foundCommit) {
      Commit.create({ ...firstComment, comments: subComments })
        .then(async (doc) => {
          console.log(`Stored Commit for Build ${doc.buildNumber}`);
          await sendSingleComment(DatamineBot, doc);
        })
        .catch((err) =>
          console.log(
            `Error storing commit (${firstComment._id}) for build ${commit.buildNumber}`,
            err.stack
          )
        );
    } else {
      for (const comment of subComments) {
        if (foundCommit._id === comment.id) return;
        if (foundCommit.comments.find((c) => c.id === comment.id)) return;
        Commit.updateOne(
          { _id: foundCommit._id },
          { $push: { comments: comment } }
        )
          .then(async () => {
            console.log(
              `Stored comment ${comment.id} for Commit ${foundCommit._id}`
            );
            await sendSingleComment(DatamineBot, {
              _id: foundCommit._id,
              title: foundCommit.title,
              ...comment,
            });
          })
          .catch((err) =>
            console.log(
              `Error storing comment (${command.id}) commit (${foundCommit._id}) for build ${foundCommit.buildNumber}`,
              err.stack
            )
          );
      }
    }
  }
};
