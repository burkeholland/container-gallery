const axios = require("axios");

module.exports = async function (context, req) {
  try {
    const results = await axios.get(
      `https://api.github.com/repos/${process.env.REPO}/contents/${process.env.FOLDER}`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_PAT}`,
        },
      }
    );

    // this folder contains all of the container template folders
    // return only the items that are folders
    const folders = results.data.filter((item) => {
      return item.type === "dir";
    });

    context.res = {
      body: folders,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err,
    };
  }
};
