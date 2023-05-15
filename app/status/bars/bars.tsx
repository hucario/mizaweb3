import cn from "@/lib/cn";
import { FC, ReactNode, useId } from "react";
import { Icon } from "react-feather";

import styles from './bars.module.css';

const Bars: FC<{
	title: ReactNode;
	className: string;
	bars: {
		className?: string;
		title: string;
		value: number;
		max: number;
		icon: Icon;
	}[]
}> = ({ title, bars, className }) => {
	const initId = useId();

	return (
		<div className={cn(styles.main, className)}>
			<span className={styles.title}>{title}</span>
			<ul>
				{bars.map((bar, i) => (
					<li key={i} className={cn(styles.barGroup, bar.className)}>
						<label htmlFor={initId + i}>
							{bar.title} ({Math.round((bar.value * 10000) / bar.max) / 100}%)
						</label>
						<progress
							className={styles.actualBar}
							value={bar.value}
							max={bar.max}
							id={initId + i}
						/>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Bars;