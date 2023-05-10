import range from "@/lib/range";
import { CSSProperties } from "react";
import styles from "./orbitals.module.css";

export default function Orbitals({
	src,
	className = "",
	style = {},
	filterShadow = false
}: {
		src: string,
		className?: string,
		style?: CSSProperties,
		/** Use expensive `filter`-based drop shadow? Image is not a circle */
		filterShadow?: boolean
}) {
	return (
		<div
			className={[styles.orbitals, filterShadow ? styles.filterShadow : false, className].filter((e) => !!e).join(" ")}
			style={style}
		>
			{range(5).map((e) => {
				return (
					<img
						key={e}
						draggable={false}
						className={styles.orbital}
						style={{
							'--hue': `${e * 72}deg`,
							'--degree': -e * 4 + "",
						} as CSSProperties}
						alt=""
						src={src}
					/>
				);
			})}
		</div>
	);
}
