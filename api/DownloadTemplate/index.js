const repo = require("github-download-parts");
const fs = require("fs");
const archiver = require("archiver");
const tempDirectory = require("temp-dir");

async function zipFolder(dir) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${dir}.zip`);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      resolve(output);
    });

    archive.pipe(output);

    archive.directory(`${dir}`, false);

    archive.finalize();
  });
}

module.exports = async function (context, req) {
  // create the temp download directory
  const tempDir = await fs.promises.mkdtemp(`${tempDirectory}/tmp`);
  const template = req.query.template;

  await repo(
    process.env.REPO,
    `${tempDir}/${template}`,
    `${process.env.FOLDER}/${template}`
  );

  await zipFolder(`${tempDir}/${template}`);
  const rawFile = await fs.promises.readFile(`${tempDir}/${template}.zip`);

  const buffer = Buffer.from(rawFile, "base64");

  context.res = {
    // status: 200, /* Defaults to 200 */
    status: 202,
    body: buffer,
    headers: {
      "Content-Disposition": `attachment;filename=${template}.zip`,
    },
  };
};
