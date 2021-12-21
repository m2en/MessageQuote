import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
import { readdirSync } from 'fs'

dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT = process.env.clientID
const GUILD = process.env.guildID
if (TOKEN === undefined || CLIENT === undefined || GUILD === undefined) {
  throw new Error('Environment variable specification error.')
}

const rest = new REST({ version: '9' }).setToken(TOKEN)

const commands = []
const commandFiles = readdirSync('src/setup/commands').filter((file) =>
  file.endsWith('.ts')
)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

;(async () => {
  try {
    console.log('Application: Slash (/) Command - Debug Deploy Start.....')

    await rest.put(Routes.applicationGuildCommands(CLIENT, GUILD), {
      body: commands
    })

    console.log('Application: Slash (/) Command - Debug Deploy End.')
  } catch (e) {
    console.error(e)
  }
})()
