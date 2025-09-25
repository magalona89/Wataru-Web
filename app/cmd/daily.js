exports.meta = {
  name: "daily",
  version: "1.0.0",
  description: "Claim daily ₱500 reward",
  category: "games",
  prefix: "both",
  guide: "Just type !daily or /daily to get your ₱500 daily reward."
};

const DAILY_REWARD = 500;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

exports.onStart = async function ({ wataru, msg, user, database }) {
  const userId = user.id || msg.sender.id || msg.from; // Adjust depending on your framework

  // Get user data
  let userData = await database.get(`user_${userId}`) || {
    balance: 0,
    lastDaily: 0
  };

  const now = Date.now();

  if (now - userData.lastDaily < DAY_IN_MS) {
    const remaining = DAY_IN_MS - (now - userData.lastDaily);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

    await wataru.reply(
      `⏳ You already claimed your daily reward!\n\nCome back in ${hours}h ${minutes}m.`
    );
    return;
  }

  // Give reward
  userData.balance += DAILY_REWARD;
  userData.lastDaily = now;

  // Save back
  await database.set(`user_${userId}`, userData);

  await wataru.reply(
    `🎉 You have received your daily reward of ₱${DAILY_REWARD}!\n\n💰 Current Balance: ₱${userData.balance}`
  );
};
