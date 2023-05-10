import Image from 'next/image'
import styles from './index.module.css'
import Hero from '../index.assets/hero/Hero.c';

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
		</main>
	);
}
