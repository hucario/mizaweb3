import { FC } from "react"
import type { DiscordStatusResponse } from '../typings';

import styles from './sectionStyles.module.css';
import Metric from "../metric/metric";
import { Database, Globe, MessageCircle, Server, Sliders, Smile, TrendingUp, Users } from "react-feather";
import TimeVisualization from "../timevis";

const DiscordStatusSection: FC<{
	data: DiscordStatusResponse | null,
	id: string
}> = ({ data, id }) => {
	if (!data) {
		return null;
	}
	return (
		<section className={styles.sectionContainer} id={id}>
			<span className={styles.announcer}>DISCORD</span>
			<div className={styles.flexMain}>
				<TimeVisualization
					generalLabel="API latency"
					className={styles.apiLatency}
					ms={Math.round(data["API latency"] * 1000)}
				/>
				<Metric
					className={styles.cachedMessages}
					title="Cached messages"
					subtitle={data["Cached messages"]}
					extra="Cached messages"
					value={data["Cached messages"]}
					icon={Database}
				/>
				<Metric
					className={styles.shardcount}
					title="Shard count"
					value={data["Shard count"]}
					icon={Server}
				/>
				<Metric
					className={styles.servercount}
					title="Server count"
					value={data["Server count"]}
					icon={Globe}
				/>
				<Metric
					className={styles.usercount}
					title="User count"
					value={data["User count"]}
					icon={Users}
				/>
				<Metric
					className={styles.channelcount}
					title="Channel count"
					value={data["Channel count"]}
					icon={MessageCircle}
				/>
				<Metric
					className={styles.rolecount}
					title="Role count"
					value={data["Role count"]}
					icon={Sliders}
				/>
				<Metric
					className={styles.emojicount}
					title="Emoji count"
					value={data["Emoji count"]}
					icon={Smile}
				/>
			</div>
		</section>
	)
}


export default DiscordStatusSection;