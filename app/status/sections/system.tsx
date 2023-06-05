import { FC, useRef } from "react"
import type { ProcessorInfoType, SystemStatusResponse } from '../typings';

import styles from './sectionStyles.module.css';
import cn from "@/lib/cn";
import Metric from "../metric/metric";
import { Archive, Cpu, Database, HardDrive, Wifi } from "react-feather";
import { PRACTICAL_DOWNLOAD, PRACTICAL_UPLOAD, THEORETICAL_INTERNET_SPEED } from "../configure_me";
import Bars from "../bars/bars";
import { StringIPAddress } from "../typings";
import Ring from "../ring/ring";

const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
   
function niceBytes(x: number): string{

	let l = 0,
		n = x;

	while(n >= 1024 && ++l){
		n = n/1024;
	}
	
	return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const FilesystemMonitors: FC<{
	data: SystemStatusResponse['disk']
}> = ({ data }) => {
	const ipColorMap = useRef<Map<string, string>>(new Map());
	if (!data) {
		return null;
	}
	return (
		<div className={styles.files}>
			<span className={styles.filesHeader}>Filesystem Utilization</span>
			<ul>
				{Object.entries(data).map(fs => {
					let attempt = ipColorMap.current.get(fs[0].split('-')[0]);
					if (!attempt) {
						attempt = `hsl(${Math.floor(Math.random() * 365)}, 100%, 62.2%)`;
						ipColorMap.current.set(fs[0].split('-')[0], attempt);
					}


					return (
						<li key={fs[0]} className={styles.fileGroup}>
							<HardDrive
								color={attempt}
								fillOpacity="0.3"
								fill={attempt}
								size={50}
								strokeWidth={1.2}
							/>
							<label>{fs[0].split('-')[1].replaceAll('\\\\', '\\')}</label>
							<figure>
								<progress
									value={fs[1].usage}
									max={fs[1].max}
								/>
								<figcaption>
									{niceBytes(fs[1].usage)} / {niceBytes(fs[1].max)}
								</figcaption>
							</figure>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

const MemoryRing: FC<{
	data: ProcessorInfoType
}> = ({ data }) => {
	return (
		<Ring
			label={<>
				<span>
					{
						Math.round(
							(data.usage / data.max)
							* 1000
						) / 10
					}%
				</span>
				<strong>
					{niceBytes(data.usage)}/{niceBytes(data.max)}
				</strong>
				<label>Total {data.name}</label>
			</>}
			value={data.usage * 100}
			max={data.max}
		/>
	)
}

const MemoryMonitors: FC<{
	data: SystemStatusResponse['memory']
}> = ({ data }) => {
	let memory_ram = {
		name: "RAM",
		count: 0,
		usage: 0,
		max: 0,
	},
	memory_swap = {
		name: "Swap",
		count: 0,
		usage: 0,
		max: 0,
	},
	memory_total = {
		name: "Memory",
		count: 0,
		usage: 0,
		max: 0
	},
	memory_other = {
		name: "Other",
		count: 0,
		usage: 0,
		max: 0
	};
	for (let key in data) {
		const aKey = key as StringIPAddress;
		const mem = data[aKey];
		memory_total.count ++;
		memory_total.max += mem.max;
		memory_total.usage += mem.usage;

		switch (mem.name) {
			case "Swap":
				memory_swap.count ++;
				memory_swap.max += mem.max;
				memory_swap.usage += mem.usage;
				break;

			case "RAM":
				memory_ram.count ++;
				memory_ram.max += mem.max;
				memory_ram.usage += mem.usage;
				break;

			default:
				memory_other.count++;
				memory_other.max += mem.max;
				memory_other.usage += mem.usage;
				break;
		}
	}

	return (
		<div className={styles.memory}>
			<span className={styles.memoryHeader}>Memory Utilization</span>
			<div className={styles.memoryGrid}>
				<MemoryRing data={memory_total} />
				<MemoryRing data={memory_ram} />
				<MemoryRing data={memory_swap} />
				<MemoryRing data={memory_other} />
			</div>
		</div>
	)
}

const ProcessorRing: FC<{
	data: ProcessorInfoType
}> = ({ data }) => {
	return (
		<Ring
			label={<>
				<span>
					{
						Math.round(
							(data.usage / data.max)
							* 1000
						) / 10
					}%
				</span>
				<label>{data.name}</label>
			</>}
			value={data.usage * 100}
			max={data.max}
		/>
	)
}

const ProcessorMonitors: FC<{
	cpus: SystemStatusResponse['cpu']
	gpus: SystemStatusResponse['gpu']
}> = ({ cpus, gpus }) => {
	return (
		<div className={styles.memory}>
			<span className={styles.memoryHeader}>Processor Utilization</span>
			<div className={styles.memoryGrid}>
				{Object.entries(cpus).map(processor => <ProcessorRing data={processor[1]} key={processor[0]} />)}
				{Object.entries(gpus).map(processor => <ProcessorRing data={processor[1]} key={processor[0]} />)}
			</div>
		</div>
	)
}

function mulberry32(a: number) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


const SystemStatusSection: FC<{
	data: SystemStatusResponse | null,
	id: string,
	className?: string
}> = ({ data, id, className }) => {
	if (!data) {
		return null;
	}
	const d = mulberry32(1337 ^ 0xDEADBEEE);
	const DUMBASS_MODE = false;
	if (DUMBASS_MODE) {
		for (let key in data.cpu) {
			let entry = data.cpu[key as keyof typeof data.cpu]
			entry.usage = d() * 100;
		}
		for (let key in data.gpu) {
			let entry = data.gpu[key as keyof typeof data.gpu]
			entry.usage = d() * 100;
		}
		for (let key in data.memory) {
			let entry = data.memory[key as keyof typeof data.memory];
			entry.usage = d() * entry.max;
		}
	}
	return (
		<section className={cn(styles.sectionContainer, className)} id={id}>
			<div className={styles.flexMain}>
				<MemoryMonitors data={data.memory} />
				<div className={styles.procNetGroup}>
					<FilesystemMonitors data={data.disk} />
					{Object.entries(data.network)
						.filter(net => net[1].usage !== 0)
						.map((net, i) => (
						<Metric
							className={styles.networking}
							title={`Network ${i}`}
							subtitle={net[1].name}
							value={`${niceBytes(net[1].usage)}/s`}
							extra={`Max: ${PRACTICAL_DOWNLOAD}mb/s down, ${PRACTICAL_UPLOAD}mb/s up`}
							icon={Wifi}
						/>
					))}
				</div>
				<ProcessorMonitors cpus={data.cpu} gpus={data.gpu} />
			</div>
		</section>
	) 
	/**jsx
	 * 
		<Widget
			className={styles.cpuUsage}
			title="CPU usage"
			subtitle={<>
				<strong>{Math.floor(parseFloat(data["CPU usage"]) * CPU_CORES * 100) / 100}%</strong>{" "}
				of "one core"
			</>}
			value={data["CPU usage"].toString()}
			extra={`of all ${CPU_CORES} cores`}
			icon={Cpu}
		/>
		<Widget
			className={styles.ramUsage}
			title="RAM usage"
			subtitle={`${MAX_RAM}gb ddr5 + ${RAM_SWAP}gb swap`}
			value={data["RAM usage"].toString()}
			extra={`out of ${MAX_RAM + RAM_SWAP}gb`}
			icon={Database}
		/>
		<Widget
			className={styles.networkUsage}
			title="Network usage"
			subtitle={`"up to" ${THEORETICAL_INTERNET_SPEED}mbps :)`}
			value={data["Network usage"].toString()}
			extra={<>
				max{" "}
				<strong>{PRACTICAL_DOWNLOAD}mbps</strong> down /{" "}
				<strong>{PRACTICAL_UPLOAD}mbps</strong> up
			</>}
			icon={Wifi}
		/>
		<Widget
			className={styles.diskUsage}
			title="Disk usage"
			subtitle={<>
				<strong>{DISK_SSD}gb</strong> ssd +{" "}
				<strong>{DISK_HDD}gb</strong> hdd
			</>}
			value={data["Disk usage"].toString()}
			extra={<>
				{Math.round(parseFloat(data["Disk usage"]) / (DISK_SSD + DISK_HDD) * 10000) / 100}% of <strong>{DISK_SSD + DISK_HDD}gb</strong>
			</>}
			icon={HardDrive}
		/>
		<Widget
			className={styles.storedFiles}
			title="Stored files"
			subtitle="does not include files hosted off-premise"
			extra={<>
				out of <strong>{DISK_SSD + DISK_HDD}gb</strong>
			</>}
			value={`${data["Stored files"].toString()} files`}
			icon={Archive}
		/>
	 */
}

export default SystemStatusSection;