export type StringIPAddress = `${number}.${number}.${number}.${number}${string}`;

export type SystemStatusResponse = {
	cpu: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	gpu: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	memory: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	disk: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	network: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	power: {
		[key: StringIPAddress]: ProcessorInfoType
	};
	temperature: {
		[key: StringIPAddress]: ProcessorInfoType
	};
}

export type ProcessorInfoType = {
	/** "Intel(R) Xeon(R) CPU E5-2667 v4 @ 3.20GHz" */
	name: string,
	/** # of cores */
	count: number,
	/** (usage / max) * 100 = pct% */ 
	usage: number,
	max: number
}

export type DiscordStatusResponse = {
	"Shard count": number;
	"Server count": number;
	"User count": number;
	"Channel count": number;
	"Role count": number;
	"Emoji count": number;
	"Cached messages": number;
	/** expressed in seconds...? */
	"API latency": number;
	"Website URL": string;
}

export type MiscStatusResponse = {
	"Active commands": 0,
	"Connected voice channels": 0,
	"Active audio players": 0,
	"Total data transmitted": 5690314887768.163,
	"Hosted storage": 189836292748,
	"System time": "2023-05-11T04:42:41.901975",
	"Uptime (past week)": 0.2488095238095238,
	"Command count": 156,
	"Code size": [
		1880499,
		51172
	]
}

export type StatusResponse = [{
	system: SystemStatusResponse;
	discord: DiscordStatusResponse;
	misc: MiscStatusResponse;
}]