import cn from "@/lib/cn";
import { FC, ReactNode } from "react";
import { Icon } from "react-feather";

import styles from './metric.module.css';

const Metric: FC<{
	className: string;
	title: string;
	subtitle?: ReactNode;
	value: ReactNode;
	extra?: ReactNode;
	icon: Icon;
}> = ({ className, title, subtitle, extra, value, icon: Icon }) => {
	return (
		<div className={cn(styles.widget, className)}>
			<div className={styles.titleLine}>
				<h5 className={styles.title}>{title}</h5>
				<div className={styles.spacer} />
				<Icon className={styles.icon} />
			</div>
			<span className={styles.subtitle}>{subtitle}</span>
			<div className={styles.spacer} />
			<div className={styles.right}>
				<span className={styles.value}>{value}</span>
				<span className={styles.extra}>{extra}</span>
			</div>
		</div>
	)
}

export default Metric;