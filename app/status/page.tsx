"use client";
// temporarily. only in dev for hot reloading. if you see this later, delete the use client thing.

import styles from './statuspage.module.css';
import { Metadata } from 'next';
import { StatusResponse } from './typings';

import Navbar from './navbar';
import ScrollLinks from './scrolllinks/scrolllinks';

import DiscordStatusSection from './sections/discord';
import MiscStatusSection from './sections/misc';
import SystemStatusSection from './sections/system';


const mockApiResponse: StatusResponse = {
	"system": {
		"cpu": {
			"162.33.23.81": {
				"name": "Intel(R) Xeon(R) CPU E5-2667 v4 @ 3.20GHz",
				"count": 2,
				"usage": 0.009000000000000001,
				"max": 1,
				"time": 1683744164.5298686
			},
			"14.201.105.203": {
				"name": "AMD Ryzen 5 7600 6-Core Processor",
				"count": 12,
				"usage": 0.008,
				"max": 1,
				"time": 1683744161.7961357
			},
			"104.254.244.219": {
				"name": "Intel(R) Xeon(R) Gold 6230R CPU @ 2.10GHz",
				"count": 2,
				"usage": 0.009000000000000001,
				"max": 1,
				"time": 1683744164.5235405
			}
		},
		"gpu": {
			"14.201.105.203-0": {
				"name": "NVIDIA GeForce RTX 4070",
				"count": 46,
				"usage": 0,
				"max": 1,
				"time": 1683744161.7961357
			}
		},
		"memory": {
			"162.33.23.81-v": {
				"name": "RAM",
				"count": 1,
				"usage": 248123392,
				"max": 1028657152,
				"time": 1683744164.5298686
			},
			"162.33.23.81-s": {
				"name": "Swap",
				"count": 1,
				"usage": 0,
				"max": 0,
				"time": 1683744164.5298686
			},
			"14.201.105.203-v": {
				"name": "RAM",
				"count": 1,
				"usage": 14025404416,
				"max": 33454333952,
				"time": 1683744161.7961357
			},
			"14.201.105.203-s": {
				"name": "Swap",
				"count": 1,
				"usage": 61665280,
				"max": 34359738368,
				"time": 1683744161.7961357
			},
			"14.201.105.203-0": {
				"name": "NVIDIA GeForce RTX 4070",
				"count": 1,
				"usage": 1943011328,
				"max": 12878610432,
				"time": 1683744161.7961357
			},
			"104.254.244.219-v": {
				"name": "RAM",
				"count": 1,
				"usage": 398610432,
				"max": 1835827200,
				"time": 1683744164.5235405
			},
			"104.254.244.219-s": {
				"name": "Swap",
				"count": 1,
				"usage": 28655616,
				"max": 2147479552,
				"time": 1683744164.5235405
			}
		},
		"disk": {
			"162.33.23.81-/": {
				"name": "/",
				"count": 1,
				"usage": 4724703232,
				"max": 10502688768,
				"time": 1683744164.5298686
			},
			"14.201.105.203-C:\\\\": {
				"name": "C:\\\\",
				"count": 1,
				"usage": 200987078656,
				"max": 249403711488,
				"time": 1683744161.7961357
			},
			"14.201.105.203-H:\\\\": {
				"name": "H:\\\\",
				"count": 1,
				"usage": 159258230784,
				"max": 4000785088512,
				"time": 1683744161.7961357
			},
			"104.254.244.219-/": {
				"name": "/",
				"count": 1,
				"usage": 3794100224,
				"max": 8009023488,
				"time": 1683744164.5235405
			},
			"104.254.244.219-/boot": {
				"name": "/boot",
				"count": 1,
				"usage": 249167872,
				"max": 531267584,
				"time": 1683744164.5235405
			}
		},
		"network": {
			"162.33.23.81": {
				"name": "Downstream",
				"count": 1,
				"usage": 0,
				"max": -1,
				"time": 1683744164.5298686
			},
			"14.201.105.203": {
				"name": "Downstream",
				"count": 1,
				"usage": 22721.777777777777,
				"max": -1,
				"time": 1683744161.7961357
			},
			"104.254.244.219": {
				"name": "Downstream",
				"count": 1,
				"usage": 0,
				"max": -1,
				"time": 1683744164.5235405
			}
		}
	},
	"discord": {
		"Shard count": 3,
		"Server count": 415,
		"User count": 12052,
		"Channel count": 12833,
		"Role count": 9243,
		"Emoji count": 10015,
		"Cached messages": 10884,
		"API latency": 0.2369835376739502,
		"Website URL": "https://mizabot.xyz"
	},
	"misc": {
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
};

export default function StatusPage() {
	const apiResponse: StatusResponse | null = mockApiResponse;
	/*
		these used to call useId(), but I
		decided that it would be
		better to have actually readable
		ids instead of #:r1x2:
	*/
	const sysId = 'system';
	const discordId = 'discord';
	const miscId = 'misc';

	return (
		<div className={styles.fullPageContainer}>
			<Navbar>
				<ScrollLinks
					links={[
						{
							title: 'System',
							elemId: sysId
						},
						{
							title: 'Discord',
							elemId: discordId
						},
						{
							title: 'Miscellaneous',
							elemId: miscId
						}
					]}
				/>
			</Navbar>
			<SystemStatusSection data={apiResponse?.system ?? null} id={sysId} className={styles.hasPadding} />
			<DiscordStatusSection data={apiResponse?.discord ?? null} id={discordId} />
			<MiscStatusSection data={apiResponse?.misc ?? null} id={miscId} />
		</div>
	)
}

/*
export const metadata: Metadata = {
	title: {
		absolute: "MizAnalytics",
		template: "%s | MizAnalytics",
	},
}
*/