import { config } from "dotenv";
import { LanguageDetect } from "./modules/LanguageDetect";
import { OpenAICompletion } from "./modules/OpenAiCompletion";
import { Telegraf, Markup } from "telegraf";
import { UserController } from "./modules/Controllers/UserController";
import { BannedUserController } from "./modules/Controllers/BannedUserController";
import { AdminController } from "./modules/Controllers/AdminsController";
import { OpenAiChat } from "./modules/OpenAiChat";
import { splitMessage } from "./modules/splitMessage";
config();

const openai = new OpenAICompletion();
const openAiChat = new OpenAiChat();
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);
const languageDetector = new LanguageDetect();
const UserDB = new UserController();
const BannedDB = new BannedUserController();
const AdminDB = new AdminController();

bot.command("start", async (ctx) => {
  const message = `Привет, ${ctx.message.from.username}.\nЯ бот который поможет тебе опробовать chatGPT без зарубежного номера для регистрации.\nЧтобы воспользоваться ботом напиши команду "/chat <текст>".\nПример: "/chat что такое ChatGPT". `;
  await ctx.reply(message);
  await UserDB.addUser(ctx.message.from.username, ctx.message.from.id);
});

// bot.command("chat", async (ctx) => {
//   if ((await BannedDB.findUserById(ctx.message.from.id)) != null) {
//     ctx.reply(
//       "Вы были заблокированы.\nВы можете связаться с разработчиком и узнать причину блокировки, воспользовавшись командой /author"
//     );
//     return;
//   }

//   try {
//     const prompts = splitMessage(ctx.message.text);
//     if (prompts) {
//       const waitMessageId = (await ctx.reply("Пожалуйста подождите"))
//         .message_id;
//       const response = (await openai.getCompletion(`${prompts}`)).text;
//       const codeLanguage = languageDetector.detectLanguage(`${response}`);
//       if (codeLanguage != "Natural") {
//         try {
//           await ctx.replyWithMarkdownV2(
//             "```" + `${codeLanguage} ` + `${response}` + "```"
//           );
//         } catch (error) {
//           await ctx.reply(`${response}`);
//         }
//       } else {
//         await ctx.reply(`${response}`);
//       }
//       bot.telegram.deleteMessage(ctx.chat.id, waitMessageId);
//     } else {
//       await ctx.reply("Похоже вы не ввели текст");
//     }
//   } catch (error) {
//     console.log(error);
//     await ctx.reply(
//       "Простите, произошла ошибка, пожалуйста переформулируйте свой запрос и попробуйте ещё раз.\nЕсли ошибка не пропала, напишите сюда.\nt.me/vaylots"
//     );
//   }
// });

bot.command("chat", async (ctx) => {
  if ((await BannedDB.findUserById(ctx.message.from.id)) != null) {
    ctx.reply(
      "Вы были заблокированы.\nВы можете связаться с разработчиком и узнать причину блокировки, воспользовавшись командой /author"
    );
    return;
  }

  const prompts = splitMessage(ctx.message.text);
  if (prompts) {
    try {
      const waitMessageId = (await ctx.reply("Пожалуйста подождите"))
        .message_id;
      const [status, response] = await openAiChat.getCompletion(`${prompts}`);
      if (status == 200) {
        const codeLanguage = languageDetector.detectLanguage(`${response}`);
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
      }
      if(status == 429) await ctx.reply("Бот сейчас испытывает большие нагрузки, пожалуйста подождите около минуты и попробуйте снова")
      await bot.telegram.deleteMessage(ctx.chat.id, waitMessageId);
    } catch (error) {
      console.log(error);
      await ctx.reply(
        "Простите, произошла ошибка, пожалуйста переформулируйте свой запрос и попробуйте ещё раз.\nЕсли ошибка не пропала, напишите сюда.\nt.me/vaylots"
      );
    }
  } else {
    await ctx.reply("Похоже вы не ввели текст");
  }
});

bot.command("author", async (ctx) => {
  await ctx.reply(
    `Тут можно найти автора`,
    Markup.inlineKeyboard([
      Markup.button.url("Vaylots", "https://vaylots-portfolio.vercel.app"),
    ])
  );
});

bot.command("ban", async (ctx) => {
  if ((await AdminDB.findUserById(ctx.message.from.id)) == null) {
    return ctx.reply(`У вас нет прав на использование данной команды`);
  } else {
    try {
      const idForBan = splitMessage(ctx.message.text);
      await BannedDB.banUser(parseInt(idForBan));
      await ctx.reply("Пользователь забанен");
    } catch (error) {
      console.log(error);
      await ctx.reply(`Не удалось забанить пользователя`);
    }
  }
});

bot.command("unban", async (ctx) => {
  if ((await AdminDB.findUserById(ctx.message.from.id)) == null) {
    return ctx.reply(`У вас нет прав на использование данной команды`);
  } else {
    try {
      const idForUnBan = splitMessage(ctx.message.text);
      await BannedDB.unBanUser(parseInt(idForUnBan));
      await ctx.reply("Пользователь разбанен");
    } catch (error) {
      console.log(error);
      await ctx.reply(`Не удалось разбанить пользователя`);
    }
  }
});

bot.command("sendall", async (ctx) => {
  if ((await AdminDB.findUserById(ctx.message.from.id)) == null) {
    return ctx.reply(`У вас нет прав на использование данной команды`);
  } else {
    try {
      const message = splitMessage(ctx.message.text);
      if (message) {
        const users = await UserDB.getAllUsers();
        console.log(users);
        users.map((user) => {
          try {
            bot.telegram.sendMessage(user.userId, message);
          } catch (error) {
            console.log(error);
            ctx.reply(`${user.userId} сообщение не доставлено`);
          }
        });
      } else {
        ctx.reply("Похоже вы не ввели текст");
      }
    } catch (error) {
      console.log(error);
      ctx.reply("error");
    }
  }
});
bot.launch();
