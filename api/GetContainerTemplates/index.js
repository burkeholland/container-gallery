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

    const folders = results.data.reduce((filtered, item) => {
      if (item.type === "dir") {
        filtered.push({
          name: item.name,
          title: item.name
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" "),
        });
      }
      return filtered;
    }, []);

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
