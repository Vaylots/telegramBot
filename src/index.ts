import { config } from "dotenv";
import { LanguageDetect } from "./modules/LanguageDetect";
import { OpenAICompletion } from "./modules/OpenAiCompletion";
import { Telegraf, Markup } from "telegraf";
config();

const openai = new OpenAICompletion();
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);
const languageDetector = new LanguageDetect();

// Welcome the user to the bot and provide instructions on how to use it!
bot.command("start", async (ctx) => {
  const message = `Привет, ${ctx.message.from.username}.\nЯ бот который поможет тебе опробовать chatGPT без зарубежного номера для регистрации.\nЧтобы воспользоваться ботом напиши команду "/chat <текст>".\nПример: "/chat что такое ChatGPT". `;
  await ctx.reply(message);
});

bot.command("chat", async (ctx) => {
  try {
    // Splitting the message into an array and removing the first element
    let message: string[] = ctx.message.text.split(" ");
    message.splice(0, 1);
    // This line joins the elements of the prompts array into a single prompt string, separated by spaces.
    const prompts: string = message.join(" ");
    // If there are prompts, the bot sends a request to the open ai api and then sends the response to the user.
    if (prompts) {
      //  Assigning the message_id of the reply to the waitMessageId variable for deleting in future
      const waitMessageId = (await ctx.reply("Пожалуйста подождите"))
        .message_id;
      // This line is awaiting a response from the openai API based on the prompts provided
      const response = (await openai.getCompletion(`${prompts}`)).text;
      // This line is detecting the language of the response variable and assigning it to the codeLanguage variable
      const codeLanguage = languageDetector.detectLanguage(`${response}`);
      /* 
        This code checks if the code language is not "Natural" and if so, it will try to reply with a markdown version of the response. 
        If it fails, it will reply with the response without markdown. 
        If the code language is "Natural", it will reply with the response without markdown.
      */
      if (codeLanguage != "Natural") {
        try {
          await ctx.replyWithMarkdownV2(
            "```" + `${codeLanguage} ` + `${response}` + "```"
          );
        } catch (error) {
          await ctx.reply(`${response}`);
        }
      } else {
        await ctx.reply(`${response}`);
      }
      // This line deletes a message from the chat with the given chat ID and message ID.
      bot.telegram.deleteMessage(ctx.chat.id, waitMessageId);
    } else {
      await ctx.reply("Похоже вы не ввели текст");
    }
  } catch (error) {
    /*
    If an error occurs in processing the command, 
    output the error to the console and send the user a message 
    asking them to reformulate the request and the Telegram of the author for communication.
    */
    console.log(error);
    await ctx.reply(
      "Простите, произошла ошибка, пожалуйста переформулируйте свой запрос и попробуйте ещё раз.\nЕсли ошибка не пропала, напишите сюда.\nt.me/vaylots"
    );
  }
});

// This command provides a link to the author's portfolio.
bot.command("author", async (ctx) => {
  ctx.reply(
    `Тут можно найти автора`,
    Markup.inlineKeyboard([
      Markup.button.url("Vaylots", "https://vaylots-portfolio.vercel.app"),
    ])
  );
});

bot.launch();
