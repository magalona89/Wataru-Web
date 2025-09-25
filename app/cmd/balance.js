exports.meta = {
  name: "balance",
  version: "1.0.0",
  description: "Check your current balance",
  category: "games",
  prefix: "both",
  guide: "Type !balance or /balance to see your money"
};

exports.onStart = async function ({ wataru, msg, user, database }) {
  const userId = user.id || msg.sender.id || msg.from; // adjust depending on your platform

  // Fetch user data
  let userData = await database.get(`user_${userId}`);

  if (!userData) {
    await wataru.reply("🙁 Wala ka pang pera. Gamitin mo muna ang command na `!daily` para kumita!");
    return;
  }

  const balance = userData.balance || 0;

  await wataru.reply(`💰 Your Current Balance:\n\n₱${balance}`);
};
