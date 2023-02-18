# Telegrambot

TelegramAiBot — это проект, использующий [Telegraf](https://telegraf.js.org/) библиотеку на `Node`. Он также использует [OpenAI](https://openai.com/) библиотеку для ответа пользователям с помощью модели `text-davinci-003`.

## Installation

1.  Склонируйте репозиторий: `git clone https://github.com/Vaylots/TelegramAiBot.git`

2.  Установите все зависимости командой: `npm install`

3.  Создайте `.env` файл

4.  Добавьте ваш токен от телеграм бота в `.env` в переменную `BOT_TOKEN`

5.  Добавьте ваш ключ от OpenAI api в `.env` в переменную `OPENAI_API_KEY`

6.  Добавьте вашу ссылку для подключения к MongoDB в `.env` в переменную `DATABASE_URL`  

7.  Запустите бота командой: `npm run start:prod:db`
