import { TwitchAPI } from "./twich/twitch";
import { DiscrodService } from "./discrod/discord";

class Config {
	TwitchToken: string
	DiscordToken: string
	DiscordChannel: string
	Roles: string[]
}

const streamsStatus = {} as any

const app = async (config: Config) => {
	const t = new TwitchAPI(config.TwitchToken)
	const d = new DiscrodService(config.DiscordToken)

	let toNotify: string[] = []

	config.Roles.forEach(async r => {
		let status: boolean = await t.IsStreamLive(r)

		if (streamsStatus[r] == null || streamsStatus[r] == true) {
			streamsStatus[r] = status
			return
		}

		if (status == true) {
			streamsStatus[r] = status
			toNotify.push(r)		
		}
	});

	if (toNotify.length > 0)
		d.Notify(toNotify)
}

(async () => {
    try {
		const config: Config = {
			TwitchToken: process.env.TWITCH_TOKEN,
			DiscordToken: process.env.DISCORD_TOKEN,
			Roles: process.env.ROLES.split(','),
			DiscordChannel: process.env.CHAN,
		}

		setInterval(async () => await app(config), 60_000);

    } catch (e) {
        console.log(Date.now() + e);
    }
})()