import { config } from "dotenv";
import { LanguageDetect } from "./modules/LanguageDetect";
import { OpenAICompletion } from "./modules/OpenAiCompletion";
import { Telegraf, Markup } from "telegraf";
config();

const openai = new OpenAICompletion();
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);
const languageDetector = new LanguageDetect();

bot.command("start", async (ctx) => {
  const message = `Привет, ${ctx.message.from.username}, я бот который поможет тебе опробовать chatGPT без зарубежного номера для регистрации. Чтобы воспользоваться ботом напиши команду "/chat <текст>", пример "/chat что такое ChatGPT". `;
  await ctx.reply(message);
});

bot.command("chat", async (ctx) => {
  try {
    let message: string[] = ctx.message.text.split(" ");
    message.splice(0, 1);
    const prompts: string = message.join(" ");
    if (prompts) {
      const waitMessageId = (await ctx.reply("Пожалуйста подождите"))
        .message_id;
      const response = (await openai.getCompletion(`${prompts}`)).text;
      const codeLanguage = languageDetector.detectLanguage(`${response}`);
      if (codeLanguage != "Natural") {
        await ctx.replyWithMarkdownV2(
          "```" + `${codeLanguage}` + `${response}` + "```"
        );
      } else {
        await ctx.reply(`${response}`);
      }
      bot.telegram.deleteMessage(ctx.chat.id, waitMessageId);
    } else {
      await ctx.reply("Похоже вы не ввели текст");
    }
  } catch (error) {
    console.log(error);
    await ctx.reply(
      "Простите, произошла ошибка, пожалуйста переформулируйте свой запрос и попробуйте ещё раз.\nЕсли ошибка не пропала, напишите сюда.\nt.me/vaylots"
    );
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
