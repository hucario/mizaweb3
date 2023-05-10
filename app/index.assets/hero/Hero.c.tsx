import Image from "next/image";

import styles from "./hero.module.css";

import Orbitals from "../orbitals/orbitals.c";

import star from "../orbitals/star.svg";
import upside_down from "../orbitals/upside_down.svg";

import hero_image from './logo.png';

export default function Hero() {
	return (
		<div className={styles.hero}>
			<Orbitals className={styles.leftOrb} src={star.src} filterShadow />
			<Orbitals className={styles.rightOrb} src={upside_down.src} />
			<div className={styles.heroText}>
				<div className={styles.holder}>
					<div className={styles.mizaImg}>
						<Image
							src={hero_image}
							draggable={false}
							sizes="20vw"
							alt=""
							fill
						/>
					</div>
					<div className={styles.right}>
						<h1 className={styles.name}>Miza</h1>
						<p className={styles.exp}>is your local loyal multipurpose discord bot</p>
					</div>
				</div>
			</div>
		</div>
	);
}
