import { FC } from "react"
import type { StatusMiscInfo } from '../typings';

import styles from './sectionStyles.module.css';
import Widget from "../widget/widget";

const MiscStatusSection: FC<{
	data: StatusMiscInfo | null,
	id: string
}> = ({ data, id }) => {
	if (!data) {
		return null;
	}
	return (
		<section className={styles.sectionContainer} id={id}>
		<span className={styles.announcer}>MISCELLANEOUS</span>
			{JSON.stringify(data, null, '\t')}

		</section>
	)
}


export default MiscStatusSection;