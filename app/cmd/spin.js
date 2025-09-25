exports.meta = {
  name: "spin",
  version: "1.0.0",
  description: "Spin the wheel to earn random money!",
  category: "games",
  prefix: "both",
  guide: "Use !spin or /spin to test your luck!"
};

exports.onStart = async function ({ wataru, msg, user, database }) {
  const userId = user.id || msg.sender.id || msg.from;

  // Load user data
  let userData = await database.get(`user_${userId}`) || {
    balance: 0
  };

  // Optional: Require at least ₱50 to spin
  const cost = 50;
  if (userData.balance < cost) {
    await wataru.reply(`❌ You need at least ₱${cost} to spin.\n💰 Your balance: ₱${userData.balance}`);
    return;
  }

  // Deduct cost
  userData.balance -= cost;

  // Define spin outcomes
  const outcomes = [
    { text: "🎉 You won ₱1000!", amount: 1000 },
    { text: "✨ You won ₱500!", amount: 500 },
    { text: "👍 You won ₱250!", amount: 250 },
    { text: "😐 You won ₱100", amount: 100 },
    { text: "🙃 You got nothing.", amount: 0 },
    { text: "😢 You lost ₱100!", amount: -100 },
    { text: "💸 You lost ₱200!", amount: -200 },
  ];

  // Random outcome
  const result = outcomes[Math.floor(Math.random() * outcomes.length)];

  // Apply result
  userData.balance += result.amount;

  // Save user data
  await database.set(`user_${userId}`, userData);

  // Final reply
  await wataru.reply(
    `${result.text}\n\n💰 New Balance: ₱${userData.balance}`
  );
};
