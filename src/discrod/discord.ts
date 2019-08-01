import * as Discrod from "discord.js";

export class DiscrodService {
	private _token:string
	
	constructor(token: string) {
		this._token = token		
	}

	public async Notify(roles: string[]): Promise<void> {
		let discord = new Discrod.Client()
		await discord.login(this._token)
		console.log(Date.now() + `авторизация ${this._token}`)

		roles.forEach(r => {
			const chan = discord.channels
				.find(ch => ch.type == 'text' && (ch as Discrod.TextChannel).name === this._token) as Discrod.TextChannel

			const role = chan.guild.roles.find('name', r)
			if (!role)
			{
				console.log(Date.now() + `роль ${r} не найдена :(`)
				return;
			}

			chan.client.options.disableEveryone = false;

			const message = `<@&${role.id}> запустил стрим https://www.twitch.tv/${r}`

			chan.send(message)
			console.log(Date.now() + message)
		});
	}
}