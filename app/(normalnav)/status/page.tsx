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
  Decimation,
  ChartData,
  TimeScale,
  ChartConfiguration
} from 'chart.js';
import 'chartjs-adapter-luxon';
import { Line } from 'react-chartjs-2';
// import { ChartOptions } from 'react-charts';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	TimeScale,
	Tooltip,
	Filler,
	Legend,
	Decimation
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

const HUES = [0, 120, 240];
var HUEINDEX = 3;
const stringToColor = (str: string | number, s=80, l=60, opac=0.5) => {
	let h: number;
	if ((+str) > -Infinity) {
		const i = +str;
		while (i >= HUES.length) {
			HUEINDEX *= 2;
			const length = HUES.length;
			for (let j = 0; j < length; j++) {
				HUES.push(HUES[j] + 360 / HUEINDEX);
			}
		}
		h = HUES[i];
		// console.log(HUES);
	}
	else {
		h = cyrb53("" + str) % 360;
	}
	return `hsla(${h}, ${s}%, ${l}%, ${opac})`;
}


const baseOptions: ChartConfiguration<'line'>['options'] = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		filler: {
			drawTime: "beforeDatasetDraw"
		},
		legend: {
			position: 'bottom' as const,
		},
		decimation: {
			enabled: true,
			algorithm: "lttb",
			samples: 60,
			threshold: 60,
		},
	},
	animation: false,
    interaction: {
		mode: "index",
		intersect: false,
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

const stackedOptions: ChartConfiguration<'line'>['options'] = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		filler: {
			drawTime: "beforeDatasetDraw"
		},
		legend: {
			position: 'bottom' as const,
		},
		decimation: {
			enabled: true,
			algorithm: "lttb",
			samples: 60,
			threshold: 60,
		},
	},
	animation: false,
    interaction: {
		mode: "index",
		intersect: false,
	},
	scales: {
		y: {
			min: 0,
			suggestedMax: 100,
			stacked: true,
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


const mockApiResponse: StatusResponse = [{
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
		},
		"power": {
		},
		"temperature": {
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
}];

function sleep(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

const NUMARRAY : number[] = [];
const STRINGDICT: any = {};
const utilD = {labels: NUMARRAY.slice(), data: structuredClone(STRINGDICT)};
const memD = {labels: NUMARRAY.slice(), data: structuredClone(STRINGDICT)};
const pwrD = {labels: NUMARRAY.slice(), data: structuredClone(STRINGDICT)};
const tempD = {labels: NUMARRAY.slice(), data: structuredClone(STRINGDICT)};
export default function StatusPage() {
	const [utilData, setUtilData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: []
	})
	const [memData, setMemData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: []
	})
	const [pwrData, setPwrData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: []
	})
	const [tempData, setTempData] = useState<ChartData<'line'>>({
		labels: [],
		datasets: []
	})
	let firstReq = true;

	//#region a
	let runOnce = useRef(false);

	useEffect(() => {
		if (runOnce.current) {
			return;
		} else {
			runOnce.current = true;
		}
		let timeout: number;
		// quadratic backoff
		let fails = 0;
		const updateFunc = async () => {
			let timeToNext = Math.pow(fails + 1, 2) * 1000 + 2000;
			let rDel = 0;
			try {
				const interval = firstReq ? "?interval=1800" : ""
				const orig = Date.now();
				const req = await fetch(API_ENDPOINT + interval);
				const resp = await req.json();
				rDel = Date.now() - orig
				// timeToNext -= rDel;
				// if (timeToNext < 1000) timeToNext = 1000;
				const reqData = firstReq? (resp as StatusResponse) : ([resp] as StatusResponse);
				setUtilData(nowChartData => {
					const bars = Math.round(window.innerWidth / 12);
					const target = utilD;
					if (reqData.length > 1) firstReq = false;
					const nextChartData = structuredClone(nowChartData);
					for (let i = 0; i < reqData.length; i++) {
						if (!reqData[i].system || !reqData[i].system.cpu) continue;
						const allProcessors = [...Object.values(reqData[i].system.cpu), ...Object.values(reqData[i].system.gpu)];

						target.labels!.push(Date.parse(reqData[i].misc["System time"]));
						const seen: any = {};
						for (let processor of allProcessors) {
							let name = processor.name;
							let j = 1;
							while (seen[name]) {
								j++;
								name = processor.name + " (" + j + ")";
							}
							seen[name] = true;
							let processorChart = nextChartData.datasets.find(e => e.label === name);
							if (!processorChart) {
								const index = Object.keys(seen).length - 1;
								nextChartData.datasets.push({
									label: name,
									backgroundColor: stringToColor(index, 80, 60, 0.4),
									showLine: true,
									borderColor: stringToColor(index, 60, 25, 1),
									pointRadius: 3,
									pointBackgroundColor: stringToColor(index, 100, 50, 0.75),
									fill: 'origin',
									tension: 0.4,
									data: []
								});
							}
							if (!target.data[name]) {
								target.data[name] = NUMARRAY.slice();
							}
							target.data[name].push(processor.usage / processor.max * 100);
						}
					}
					nextChartData.labels!.length = 0;
					while (target.labels.length > 300) target.labels.shift();
					const length = target.labels.length;
					const n = length <= bars ? 1 : Math.ceil(length / bars);
					for (let i = 0; i < target.labels.length; i += n) {
						let high = 0;
						for (let j = 0; j < n; j++) {
							high = target.labels[i] > high ? target.labels[i] : high;
						}
						nextChartData.labels!.push(high);
					}
					for (let set of nextChartData.datasets) {
						if (!set.label) continue;
						set.data!.length = 0;
						while (target.data[set.label].length > length) {
							target.data[set.label].shift()
						}
						while (target.data[set.label].length < length) {
							target.data[set.label].unshift(0);
						}
						const n = length <= bars ? 1 : Math.ceil(length / bars);
						for (let i = 0; i < length; i += n) {
							let high = 0;
							for (let j = 0; j < n; j++) {
								high = target.data[set.label][i] > high ? target.data[set.label][i] : high;
							}
							set.data!.push(high);
						}
					}
					return nextChartData;
				})
				await sleep(timeToNext / 4);
				setMemData(nowChartData => {
					const bars = Math.round(window.innerWidth / 32);
					const target = memD;
					if (reqData.length > 1) firstReq = false;
					const nextChartData = structuredClone(nowChartData);
					for (let i = 0; i < reqData.length; i++) {
						if (!reqData[i].system || !reqData[i].system.memory) continue;
						const allProcessors = Object.values(reqData[i].system.memory);

						target.labels!.push(Date.parse(reqData[i].misc["System time"]));
						const seen: any = {};
						for (let processor of allProcessors) {
							let name = processor.name;
							let j = 1;
							while (seen[name]) {
								j++;
								name = processor.name + " (" + j + ")";
							}
							seen[name] = true;
							let processorChart = nextChartData.datasets.find(e => e.label === name);
							if (!processorChart) {
								const index = Object.keys(seen).length - 1;
								nextChartData.datasets.push({
									label: name,
									backgroundColor: stringToColor(index, 80, 60, 0.4),
									showLine: true,
									borderColor: stringToColor(index, 60, 25, 1),
									pointRadius: 3,
									pointBackgroundColor: stringToColor(index, 100, 50, 0.75),
									fill: 'origin',
									tension: 0.4,
									data: []
								});
							}
							if (!target.data[name]) {
								target.data[name] = NUMARRAY.slice();
							}
							target.data[name].push(processor.usage / 1073741824);
						}
					}
					nextChartData.labels!.length = 0;
					while (target.labels.length > 300) target.labels.shift();
					const length = target.labels.length;
					const n = length <= bars ? 1 : Math.ceil(length / bars);
					for (let i = 0; i < target.labels.length; i += n) {
						let high = 0;
						for (let j = 0; j < n; j++) {
							high = target.labels[i] > high ? target.labels[i] : high;
						}
						nextChartData.labels!.push(high);
					}
					for (let set of nextChartData.datasets) {
						if (!set.label) continue;
						set.data!.length = 0;
						while (target.data[set.label].length > length) {
							target.data[set.label].shift()
						}
						while (target.data[set.label].length < length) {
							target.data[set.label].unshift(0);
						}
						const n = length <= bars ? 1 : Math.ceil(length / bars);
						for (let i = 0; i < length; i += n) {
							let high = 0;
							for (let j = 0; j < n; j++) {
								high = target.data[set.label][i] > high ? target.data[set.label][i] : high;
							}
							set.data!.push(high);
						}
					}
					return nextChartData;
				})
				await sleep(timeToNext / 4);
				setPwrData(nowChartData => {
					const bars = Math.round(window.innerWidth / 16);
					const target = pwrD;
					if (reqData.length > 1) firstReq = false;
					const nextChartData = structuredClone(nowChartData);
					for (let i = 0; i < reqData.length; i++) {
						if (!reqData[i].system || !reqData[i].system.power) continue;
						const allProcessors = Object.values(reqData[i].system.power);

						target.labels!.push(Date.parse(reqData[i].misc["System time"]));
						const seen: any = {};
						for (let processor of allProcessors) {
							let name = processor.name;
							let j = 1;
							while (seen[name]) {
								j++;
								name = processor.name + " (" + j + ")";
							}
							seen[name] = true;
							let processorChart = nextChartData.datasets.find(e => e.label === name);
							if (!processorChart) {
								const index = Object.keys(seen).length - 1;
								nextChartData.datasets.push({
									label: name,
									backgroundColor: stringToColor(index, 80, 60, 0.4),
									showLine: true,
									borderColor: stringToColor(index, 60, 25, 1),
									pointRadius: 3,
									pointBackgroundColor: stringToColor(index, 100, 50, 0.75),
									fill: 'origin',
									tension: 0.4,
									data: []
								});
							}
							if (!target.data[name]) {
								target.data[name] = NUMARRAY.slice();
							}
							target.data[name].push(processor.usage);
						}
					}
					nextChartData.labels!.length = 0;
					while (target.labels.length > 300) target.labels.shift();
					const length = target.labels.length;
					const n = length <= bars ? 1 : Math.ceil(length / bars);
					for (let i = 0; i < target.labels.length; i += n) {
						let high = 0;
						for (let j = 0; j < n; j++) {
							high = target.labels[i] > high ? target.labels[i] : high;
						}
						nextChartData.labels!.push(high);
					}
					for (let set of nextChartData.datasets) {
						if (!set.label) continue;
						set.data!.length = 0;
						while (target.data[set.label].length > length) {
							target.data[set.label].shift()
						}
						while (target.data[set.label].length < length) {
							target.data[set.label].unshift(0);
						}
						const n = length <= bars ? 1 : Math.ceil(length / bars);
						for (let i = 0; i < length; i += n) {
							let high = 0;
							for (let j = 0; j < n; j++) {
								high = target.data[set.label][i] > high ? target.data[set.label][i] : high;
							}
							set.data!.push(high);
						}
					}
					return nextChartData;
				})
				await sleep(timeToNext / 4);
				setTempData(nowChartData => {
					const bars = Math.round(window.innerWidth / 24);
					const target = tempD;
					if (reqData.length > 1) firstReq = false;
					const nextChartData = structuredClone(nowChartData);
					for (let i = 0; i < reqData.length; i++) {
						if (!reqData[i].system || !reqData[i].system.temperature) continue;
						const allProcessors = Object.values(reqData[i].system.temperature);

						target.labels!.push(Date.parse(reqData[i].misc["System time"]));
						const seen: any = {};
						for (let processor of allProcessors) {
							let name = processor.name;
							let j = 1;
							while (seen[name]) {
								j++;
								name = processor.name + " (" + j + ")";
							}
							seen[name] = true;
							let processorChart = nextChartData.datasets.find(e => e.label === name);
							if (!processorChart) {
								const index = Object.keys(seen).length - 1;
								nextChartData.datasets.push({
									label: name,
									backgroundColor: stringToColor(index, 80, 60, 0.4),
									showLine: true,
									borderColor: stringToColor(index, 60, 25, 1),
									pointRadius: 3,
									pointBackgroundColor: stringToColor(index, 100, 50, 0.75),
									fill: 'origin',
									tension: 0.4,
									data: []
								});
							}
							if (!target.data[name]) {
								target.data[name] = NUMARRAY.slice();
							}
							target.data[name].push(processor.usage);
						}
					}
					nextChartData.labels!.length = 0;
					while (target.labels.length > 300) target.labels.shift();
					const length = target.labels.length;
					const n = length <= bars ? 1 : Math.ceil(length / bars);
					for (let i = 0; i < target.labels.length; i += n) {
						let high = 0;
						for (let j = 0; j < n; j++) {
							high = target.labels[i] > high ? target.labels[i] : high;
						}
						nextChartData.labels!.push(high);
					}
					for (let set of nextChartData.datasets) {
						if (!set.label) continue;
						set.data!.length = 0;
						while (target.data[set.label].length > length) {
							target.data[set.label].shift()
						}
						while (target.data[set.label].length < length) {
							target.data[set.label].unshift(0);
						}
						const n = length <= bars ? 1 : Math.ceil(length / bars);
						for (let i = 0; i < length; i += n) {
							let high = 0;
							for (let j = 0; j < n; j++) {
								high = target.data[set.label][i] > high ? target.data[set.label][i] : high;
							}
							set.data!.push(high);
						}
					}
					return nextChartData;
				})
				fails = 0;
			} catch(e) {
				fails++;
			}
			let nDel = timeToNext / 4 - rDel;
			if (nDel < 0) nDel = 0;
			timeout = window.setTimeout(updateFunc, nDel);
		};

		updateFunc();
		return () => {
			window.clearTimeout(timeout);
		}
	}, [])
	//#endregion b

	return (
		<body>
			<div className={styles.quarterPageContainer}>
				<div className={styles.chartParent}>
					Processor Utilisation (%)
					<Line
						className={styles.chart}
						options={baseOptions}
						data={utilData}
					/>
				</div>
			</div>
			<div className={styles.quarterPageContainer}>
				<div className={styles.chartParent}>
					Memory Allocation (GB)
					<Line
						className={styles.chart}
						options={stackedOptions}
						data={memData}
					/>
				</div>
			</div>
			<div className={styles.quarterPageContainer}>
				<div className={styles.chartParent}>
					Power Consumption (W)
					<Line
						className={styles.chart}
						options={stackedOptions}
						data={pwrData}
					/>
				</div>
			</div>
			<div className={styles.quarterPageContainer}>
				<div className={styles.chartParent}>
					Temperature Monitor (C)
					<Line
						className={styles.chart}
						options={baseOptions}
						data={tempData}
					/>
				</div>
			</div>
		</body>
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