"use client";
// temporarily. only in dev for hot reloading. if you see this later, delete the use client thing.

import styles from './statuspage.module.css';
import { Metadata } from 'next';
import { StatusResponse, StringIPAddress } from './typings';

import { useEffect, useMemo, useRef, useState } from 'react';
import { API_ENDPOINT } from './configure_me';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
  TimeScale,
  ChartConfiguration
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'react-charts';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	TimeScale,
	Tooltip,
	Filler,
	Legend
);


// Overkill
const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeee ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const stringToColor = (str: string, opac=0.5, l=62.2) => {
	let hash = cyrb53(str);
	return `hsla(${hash % 360}, 70%, ${l}%, ${opac})`;
}



const options: ChartConfiguration<'line'>['options'] = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		filler: {
			drawTime: "beforeDatasetDraw"
		},
		legend: {
			position: 'bottom' as const,
		}
	},
	animation: false,
    interaction: {
		mode: "index",
		intersect: false,
	},
	elements: {
		point: {
			radius: 10
		}
	},
	
	scales: {
		y: {
			min: 0,
			suggestedMax: 100,
			stacked: false,
			
		},
		x: {
			type: 'time',
			display: true,
			ticks: {
				autoSkip: true,
				maxRotation: 0,
				major: {
					enabled: true,
				},
				callback: function(value) {
					return new Date(this.getLabelForValue(value as number)).toLocaleTimeString(undefined, {
						second: "numeric",
						minute: "numeric",
						hour: "numeric"
					}); 
				}
			}
		}
	}
};



const mockApiResponse: StatusResponse = {
	"system": {
		"cpu": {
			"162.33.23.81": {
				"name": "Intel(R) Xeon(R) CPU E5-2667 v4 @ 3.20GHz",
				"count": 2,
				"usage": 0.009000000000000001,
				"max": 1
			},
			"14.201.105.203": {
				"name": "AMD Ryzen 5 7600 6-Core Processor",
				"count": 12,
				"usage": 0.021,
				"max": 1
			},
			"104.254.244.219": {
				"name": "Intel(R) Xeon(R) Gold 6230R CPU @ 2.10GHz",
				"count": 2,
				"usage": 0.009000000000000001,
				"max": 1
			}
		},
		"gpu": {
			"14.201.105.203-0": {
				"name": "NVIDIA GeForce RTX 4070",
				"count": 46,
				"usage": 0,
				"max": 1
			}
		},
		"memory": {
			"162.33.23.81-v": {
				"name": "RAM",
				"count": 1,
				"usage": 248123392,
				"max": 1028657152
			},
			"162.33.23.81-s": {
				"name": "Swap",
				"count": 1,
				"usage": 0,
				"max": 0,
			},
			"14.201.105.203-v": {
				"name": "RAM",
				"count": 1,
				"usage": 14025404416,
				"max": 33454333952,
			},
			"14.201.105.203-s": {
				"name": "Swap",
				"count": 1,
				"usage": 61665280,
				"max": 34359738368,
			},
			"14.201.105.203-0": {
				"name": "NVIDIA GeForce RTX 4070",
				"count": 1,
				"usage": 1943011328,
				"max": 12878610432,
			},
			"104.254.244.219-v": {
				"name": "RAM",
				"count": 1,
				"usage": 398610432,
				"max": 1835827200,
			},
			"104.254.244.219-s": {
				"name": "Swap",
				"count": 1,
				"usage": 28655616,
				"max": 2147479552,
			}
		},
		"disk": {
			"162.33.23.81-/": {
				"name": "/",
				"count": 1,
				"usage": 4724703232,
				"max": 10502688768
			},
			"14.201.105.203-C:\\\\": {
				"name": "C:\\\\",
				"count": 1,
				"usage": 200987078656,
				"max": 249403711488
			},
			"14.201.105.203-H:\\\\": {
				"name": "H:\\\\",
				"count": 1,
				"usage": 159258230784,
				"max": 4000785088512,
			},
			"104.254.244.219-/": {
				"name": "/",
				"count": 1,
				"usage": 3794100224,
				"max": 8009023488,
			},
			"104.254.244.219-/boot": {
				"name": "/boot",
				"count": 1,
				"usage": 249167872,
				"max": 531267584,
			}
		},
		"network": {
			"162.33.23.81": {
				"name": "Downstream",
				"count": 1,
				"usage": 0,
				"max": -1
			},
			"14.201.105.203": {
				"name": "Downstream",
				"count": 1,
				"usage": 22721.777777777777,
				"max": -1
			},
			"104.254.244.219": {
				"name": "Downstream",
				"count": 1,
				"usage": 0,
				"max": -1
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
	const [chartData, setChartData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: []
	})

	//#region a
	let runOnce = useRef(false);

	useEffect(() => {
		if (runOnce.current) {
			return;
		} else {
			runOnce.current = true;
		}
		let timeout: number;
		// exponential backoff
		let fails = 0;
		const updateFunc = async () => {
			try {
				const req = await fetch(API_ENDPOINT);
				const reqData = await req.json() as StatusResponse;
				setChartData(nowChartData => {
				//#endregion a
	const nextChartData = structuredClone(nowChartData);

	const allProcessors = [...Object.values(reqData.system.cpu), ...Object.values(reqData.system.gpu)];

	nextChartData.labels!.push(Date.now());
	for (let processor of allProcessors) {
		let processorChart = nextChartData.datasets.find(e => e.label === processor.name);
		if (processorChart) {
			processorChart.data.push((processor.usage / processor.max) * 100)
		} else {
			nextChartData.datasets.push({
				label: processor.name,
				backgroundColor: stringToColor(processor.name),
				showLine: true,
				borderColor: stringToColor(processor.name, 1, 20),
				fill: 'origin',
				tension: 0.4,
				data: [
					(processor.usage / processor.max) * 100
				]
			})
		}
	}

	while (nextChartData.labels!.length > 10) {
		nextChartData.labels!.shift();
		for (let set of nextChartData.datasets) {
			set.data.shift();
		}
	}

	return nextChartData;


	//#region b
				})
				fails = 0;
			} catch(e) {
				fails++;
			}

			let timeToNext = Math.pow(2, fails+1) + 1;
			timeout = window.setTimeout(updateFunc, timeToNext * 1000);
		};

		updateFunc();
		return () => {
			window.clearTimeout(timeout);
		}
	}, [])
	//#endregion b

	return (
		<div className={styles.fullPageContainer}>
			<div className={styles.chartParent}>
				<Line
					className={styles.chart}
					options={options}
					data={chartData}
				/>
			</div>
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