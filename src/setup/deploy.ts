import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT = process.env.clientID
if (TOKEN === undefined || CLIENT === undefined) {
  throw new Error('Environment variable specification error.')
}

const rest = new REST({ version: '9' }).setToken(TOKEN)

/**
 * 12/12付けのPRで変更リクエストがありましたが、時間がかかりそうだし、Slash Commandの登録処理のため、保留
 * TODO: importに切り替える
 */
const commands = []
const commandFiles = fs
  .readdirSync('src/setup/commands')
  .filter((file) => file.endsWith('.ts'))
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

;(async () => {
  try {
    console.log('Application: Slash (/) Command - General Deploy Start.....')

    await rest.put(Routes.applicationCommands(CLIENT), {
      body: commands
    })

    console.log('Application: Slash (/) Command - General Deploy End.')
  } catch (e) {
    console.error(e)
  }
})()
