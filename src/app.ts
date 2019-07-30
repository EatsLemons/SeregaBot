import { TwitchAPI } from "./twich/twitch";
import * as Discrod from "discord.js";

class Config {
	TwitchToken: string
	DiscordToken: string
	DiscordChannel: string
	Roles: string[]
}

const streamsStatus = {} as any

const app = async (config: Config) => {
	const t = new TwitchAPI(config.TwitchToken)
	let discord = new Discrod.Client()

	await discord.login(config.DiscordToken)

	config.Roles.forEach(async r => {
		let status: boolean = await t.IsStreamLive(r)

		if (streamsStatus[r] == null || streamsStatus[r] == true) {
			streamsStatus[r] = status
			return
		}

		if (status == true) {
			streamsStatus[r] = status

			const chan = discord.channels
				.find(ch => ch.type == 'text' && (ch as Discrod.TextChannel).name === config.DiscordChannel) as Discrod.TextChannel

			var role = chan.guild.roles.find('name', r)
			if (!role)
			{
				console.log(`роль ${r} не найдена :(`)
				return;
			}

			chan.client.options.disableEveryone = false;
			let message:string = `<@&${role.id}> запустил свой стримчанский`
			chan.send(message)
			console.log(Date.now() + message)
		}
	});	
}

(async () => {
    try {
		const config: Config = {
			TwitchToken: process.env.TWITCH_TOKEN,
			DiscordToken: process.env.DISCORD_TOKEN,
			Roles: process.env.ROLES.split(','),
			DiscordChannel: process.env.CHAN,
		}

		setInterval(async () => await app(config), 30_000);

    } catch (e) {
        console.log(e);
    }
})()