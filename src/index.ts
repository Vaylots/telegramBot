import { config } from "dotenv";
import { OpenAICompletion } from "./modules/OpenAiCompletion";
import { DatabaseController } from "./modules/DatabaseModule";
import { Telegraf, Markup } from "telegraf";
config();

const database = new DatabaseController();
const openai = new OpenAICompletion();
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);

bot.command("start", async (ctx) => {
  const joinDate: string = new Date().toLocaleDateString();
  database.addUser(
    ctx.message.from.username,
    ctx.message.from.id.toString(),
    joinDate
  );
  const message = `Привет, ${ctx.message.from.username}, я бот который поможет тебе опробовать chatGPT без зарубежного номера для регистрации. Чтобы воспользоваться ботом напиши команду "/chat <текст>", пример "/chat что такое ChatGPT". `;
  await ctx.reply(message);
});

bot.command("chat", async (ctx) => {
  try {
    let message: string[] = ctx.message.text.split(" ");
    message.splice(0, 1);
    const prompts: string = message.join(" ");
    if (prompts) {
      await ctx.reply("Пожалуйста подождите");
      const response = (await openai.getCompletion(`${prompts}`)).text;
      console.log(response);
      await ctx.reply(`${response}`);
    } else {
      await ctx.reply("Похоже вы не ввели текст");
    }
  } catch (error) {
    console.log(error);
    await ctx.reply(
      "Простите произошла ошибка, попробуйте ещё раз.\nЕсли ошибка не пропала, напишите сюда.\nt.me/vaylots"
    );
  }
});

bot.command("users", async (ctx) => {
  if (ctx.message.from.id.toString() == "586694681") {
    const users = database.showAllUsers(ctx.message.from.id.toString());
    users.then((users) => {
      users?.forEach((user) => {
        ctx.reply(
          `id:${user.id}\nusername: ${user.username}\ntelegram_id: ${user.telegram_id}\njoin_date: ${user.join_date}`
        );
      });
    });
  }
});

bot.command("author", async (ctx) => {
  ctx.reply(
    `Тут можно найти автора`,
    Markup.inlineKeyboard([
      Markup.button.url("Vaylots", "https://vaylots-portfolio.vercel.app"),
    ])
  );
});

bot.launch();
