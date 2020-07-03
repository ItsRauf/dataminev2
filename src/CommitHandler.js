const axios = require("axios").default;
const Commit = require("./models/Commit");
const whitelist = require("./whitelist.json");

/**
 * Finds commit in database
 *
 * @param {String} buildNumber
 */
function findCommit(buildNumber) {
  return Commit.findOne({ buildNumber });
}

/**
 * Parses build number from title
 *
 * @param {String} title
 * @returns Build Number
 */
function parseBuildNumber(title) {
  const regex = /(Canary\sbuild:\s([0-9]*))/;
  if (regex.test(title)) {
    return regex.exec(title)[2];
  }
}

/**
 * Parses images from comment body
 *
 * @param {String} data
 */
function parseImages(data) {
  const imageRegex = /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/gm;
  const imageRegexTwo = /!\[.*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/m;
  const images = data.match(imageRegex);
  if (Array.isArray(images)) {
    const parsedImages = images.map((image) => {
      return {
        old: image,
        new: imageRegexTwo.exec(image)[1],
      };
    });
    return parsedImages;
  }
}

module.exports = async function commitHandler() {
  const RequestOptions = {
    auth: {
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
    },
  };
  /**
   * @type {{data: any[]}}
   */
  const commits = await axios.get(
    "https://api.github.com/repos/DJScias/Discord-Datamining/commits",
    RequestOptions,
  );
  const commitsWithComments = commits.data.filter(
    (commit) => commit.commit.comment_count >= 1,
  );
  commitsWithComments.forEach(async (commit) => {
    const title = commit.commit.message;
    const buildNumber = parseBuildNumber(title);
    const foundCommit = await findCommit(buildNumber);
    if (!foundCommit) {
      /**
       * @type {{data: any[]}}
       */
      const comments = await axios.get(commit.comments_url, RequestOptions);
      // const commentsByTiemen = comments.data.filter((comment) => comment.user.login === "ThaTiemsz");
      // const comment = commentsByTiemen[0];
      const whitelistedComments = comments.data.filter((comment) =>
        whitelist.includes(comment.user.id)
      );
      const comment = whitelistedComments[0];
      if (comment) {
        const preCommit = {
          buildNumber,
          title,
          description: comment.body,
          url: comment.html_url,
          user: {
            username: comment.user.login,
            id: comment.user.id,
            avatarURL: comment.user.avatar_url,
            url: comment.user.html_url,
          },
        };
        const images = parseImages(preCommit.description);
        if (Array.isArray(images)) {
          images.forEach((image) =>
            preCommit.description.replace(image.old, "")
          );
          preCommit.images = images.map((image) => image.new);
        }
        Commit.create(preCommit)
          .then((doc) => {
            console.log(`Stored Commit for Build ${doc.buildNumber}`);
          })
          .catch((err) =>
            console.log(
              `Error storing commit for build ${buildNumber}`,
              err.stack,
            )
          );
      }
    }
  });
};
