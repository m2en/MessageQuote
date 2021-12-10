import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config()

const TOKEN = process.env.TOKEN
const CLIENT = process.env.clientID
if (TOKEN === undefined || CLIENT === undefined) {
    throw new Error('環境変数の指定エラー')
}

const rest = new REST({ version: '9' }).setToken(TOKEN)

const commands = []
const commandFiles = fs
    .readdirSync('src/setup')
    .filter((file) => file.endsWith('.js'))
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
