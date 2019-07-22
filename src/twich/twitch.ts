import * as req from "request-promise-native"

interface User {
	name: string,
	bio: string,
	_id: number,
}

export class TwitchAPI {
	private ClientID: string

	constructor(clientId: string) {
		this.ClientID = clientId
	}

	async IsStreamLive(username: string) : Promise<boolean> {
		let user = await this.FindUser(username)

		let resp = JSON.parse(await req.get(`https://api.twitch.tv/kraken/streams?channel=${user._id}&api_version=5&client_id=${this.ClientID}`))
		
		if (resp._total > 0)
			return true;
		
		return false;
	}

	private async FindUser(username: string): Promise<User> {
		return JSON.parse(await req.get(`https://api.twitch.tv/kraken/users/${username}?client_id=${this.ClientID}`))
	}
}