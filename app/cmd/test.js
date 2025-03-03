exports.meta = {
  name: "test",
  version: "0.0.1",
  description: "Test command",
  category: "test",
  prefix: "both",
  guide: ""
};

exports.onStart = async function ({ wataru }) {
  wataru.reply("Hey");
};
