import cn from "@/lib/cn";
import { FC, ReactNode, useId } from "react";
import { Icon } from "react-feather";

import styles from './ring.module.css';

const Ring: FC<{
	label: ReactNode;
	className?: string;
	value: number;
	max: number;
}> = ({ label, value, max, className }) => {
	const circumference = 50 * 2 * Math.PI;
	const pct = value / max;

	const offset = circumference - pct / 100 * circumference;
	return (
		<figure className={cn(styles.main, className)}>
			<svg viewBox="0 0 120 120">
				<circle
					className={styles.circle}
					stroke="rgb(var(--light))"
					strokeWidth="6"
					strokeDasharray={`${circumference} ${circumference}`}
					strokeDashoffset={offset}
					fill="transparent"
					r="50"
					cx="60"
					cy="60"
				/>
				<circle
					className={styles.circle2}
					stroke="rgba(var(--dark), 0.3)"
					strokeWidth="6"
					fill="transparent"
					r="50"
					cx="60"
					cy="60"
				/>
			</svg>
			<figcaption>
				<div className={styles.center}>
					{label}
				</div>
			</figcaption>
		</figure>
	)
}

export default Ring;