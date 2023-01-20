# Telegrambot

TelegramAiBot — это проект, использующий [Telegraf](https://telegraf.js.org/) библиотеку на `Node`. Он также использует [OpenAI](https://openai.com/) библиотеку для ответа пользователям с помощью модели `text-davinci-003`.

## Requirements

- Node 18.11.18 or higher

## Installation

1.  Склонируйте репозиторий: `git clone https://github.com/Vaylots/TelegramAiBot.git`

2.  Установите все зависимости Командой: `npm install`

3.  Создайте новый билд командой: `npm run build`

4.  Создайте `.env` файл

5.  Добавьте ваш токен от телеграм бота в `.env` в переменную `BOT_TOKEN`

6.  Добавьте ваш ключ от OpenAI api в `.env` в переменную `OPENAI_API_KEY`

7.  Запустите бота командой: `npm start`
