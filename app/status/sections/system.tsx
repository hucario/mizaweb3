import { FC } from "react"
import type { SystemStatusResponse } from '../typings';

import styles from './sectionStyles.module.css';
import cn from "@/lib/cn";
import Widget from "../widget/widget";
import { Archive, Cpu, Database, HardDrive, Wifi } from "react-feather";
import { PRACTICAL_DOWNLOAD, PRACTICAL_UPLOAD, THEORETICAL_INTERNET_SPEED } from "../configure_me";

const SystemStatusSection: FC<{
	data: SystemStatusResponse | null,
	id: string,
	className?: string
}> = ({ data, id, className }) => {
	if (!data) {
		return null;
	}
	return (
		<section className={cn(styles.sectionContainer, className)} id={id}>
			<div className={styles.flexMain}>
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