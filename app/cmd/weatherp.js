const axios = require("axios");

exports.meta = {
  name: "beta",
  aliases: ["weather", "forecast", "wthr"],
  prefix: "both",
  version: "2.0.1",
  author: "Manuelson | Modified by BIOSCOPE PRO",
  description: "Get live weather forecast, air quality index, and alerts for any city.",
  guide: ["<city name>"],
  category: "AI"
};

exports.onStart = async function({ wataru, msg, chatId, args }) {
  const city = args.join(" ").trim() || "Manila"; // Default to Manila
  const apiKey = "8d4c6ed946d54f4eb4360142251710"; // WeatherAPI key
  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=1&aqi=yes&alerts=yes`;

  try {
    // Show typing indicator
    if (wataru.sendTyping) wataru.sendTyping(chatId, true);

    const { data } = await axios.get(apiUrl);
    const current = data.current;
    const forecast = data.forecast.forecastday[0].day;
    const alerts = data.alerts?.alert || [];

    let reply = [
      `🌤 **Weather Forecast for ${data.location.name}, ${data.location.country}**`,
      `📅 Date: ${data.forecast.forecastday[0].date}`,
      `🌡 Current Temp: ${current.temp_c}°C`,
      `🌥 Condition: ${current.condition.text}`,
      `🌡 Max Temp: ${forecast.maxtemp_c}°C | Min Temp: ${forecast.mintemp_c}°C`,
      `☔ Chance of Rain: ${forecast.daily_chance_of_rain}%`,
      `💨 Wind: ${current.wind_kph} kph`,
      `🌬 Air Quality (CO): ${current.air_quality.co.toFixed(2)}`
    ].join("\n");

    if (alerts.length > 0) {
      reply += `\n⚠️ **Weather Alerts:**\n`;
      alerts.forEach((alert, i) => {
        reply += `${i + 1}. ${alert.headline}\n${alert.desc}\n`;
      });
    } else {
      reply += `\n✅ No weather alerts today.`;
    }

    reply += `\n\n🕒 Updated: ${data.current.last_updated}`;
    reply += `\n━━━━━━━━━━━━━━━━━━━\n🔹 **Powered by BIOSCOPE BETA**`;

    await wataru.reply(reply);
  } catch (error) {
    console.error("❌ AIWeather Error:", error.response?.data || error.message);
    await wataru.reply("❌ Failed to fetch weather data. Please check the city name and try again.");
  }
};
