const axios = require("axios");

exports.meta = {
  name: "cosplay",
  version: "0.0.1",
  description: "Get a random cosplay video.",
  category: "anime",
  prefix: "both",
  guide: "",
};

exports.onStart = async function ({ wataru }) {
  try {
    // Define the GitHub repository details
    const owner = "ajirodesu";
    const repo = "cosplay";
    const branch = "main";

    // Construct the URL for the repository directory
    const repoUrl = `https://github.com/${owner}/${repo}/tree/${branch}/`;

    // Fetch the HTML content of the repository directory
    const response = await axios.get(repoUrl);
    const html = response.data;

    // Use a regular expression to extract video filenames (ending with .mp4) from the HTML
    const videoFileRegex = /href="\/ajirodesu\/cosplay\/blob\/main\/([^"]+\.mp4)"/g;
    const videoFiles = [];
    let match;
    while ((match = videoFileRegex.exec(html)) !== null) {
      videoFiles.push(match[1]);
    }

    if (videoFiles.length === 0) {
      return wataru.reply("No cosplay videos found in the repository.");
    }

    // Select a random video from the list
    const randomVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];

    // Construct the raw URL for the selected video
    const videoUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${randomVideo}`;

    // Send the random cosplay video using wataru
    wataru.video(videoUrl);
  } catch (error) {
    console.error("Error fetching random cosplay video:", error);
    wataru.reply("An error occurred while fetching a cosplay video. Please try again later.");
  }
};
