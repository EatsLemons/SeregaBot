import { TwitchAPI } from "./twich/twitch";
import * as Discrod from "discord.js";

class Config {
	TwitchToken: string
	DiscordToken: string
	DiscordChannel: string
	Roles: string[]
}

const parseConf = () => {
	let conf = new Config()
	process.argv.forEach(a => {
		if (a.startsWith('chan='))
			conf.DiscordChannel = a.split('=')[1]
		else if (a.startsWith('roles='))
			conf.Roles = a.split('=')[1].split(',')
		else if (a.startsWith('d_token='))
			conf.DiscordToken = a.split('=')[1]
		else if (a.startsWith('t_token='))
			conf.TwitchToken = a.split('=')[1]
	})

	return conf;
}

const streamsStatus = {} as any

const app = async () => {
	const config = parseConf()

	const t = new TwitchAPI(config.TwitchToken)
	let discord = new Discrod.Client()

	await discord.login(config.DiscordToken)

	console.log(streamsStatus)

	config.Roles.forEach(async r => {
		let status: boolean = await t.IsStreamLive(r)

		console.log(`${r} is ${status}`)

		if (streamsStatus[r] == null || streamsStatus[r] == true) {
			streamsStatus[r] = status
			return
		}

		if (status == true) {
			streamsStatus[r] = status

			const chan = discord.channels
				.find(ch => ch.type == 'text' && (ch as Discrod.TextChannel).name === config.DiscordChannel) as Discrod.TextChannel

			var role = chan.guild.roles.find('name', r)

			chan.client.options.disableEveryone = false;
			chan.send(`<@&${role.id}> запустил свою балалайку`)
		}
	});	
}

(async () => {
    try {
		setInterval(await app, 10_000);
    } catch (e) {
        console.log(e);
    }
})()