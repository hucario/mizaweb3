import { FC } from "react"
import type { DiscordStatusResponse } from '../typings';

import styles from './sectionStyles.module.css';
import Widget from "../widget/widget";
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
					ms={data["API latency"] * 1000}
				/>
				<Widget
					className={styles.cachedMessages}
					title="Cached messages"
					subtitle={data["Cached messages"]}
					extra="Cached messages"
					value={data["Cached messages"]}
					icon={Database}
				/>
				<Widget
					className={styles.shardcount}
					title="Shard count"
					value={data["Shard count"]}
					icon={Server}
				/>
				<Widget
					className={styles.servercount}
					title="Server count"
					value={data["Server count"]}
					icon={Globe}
				/>
				<Widget
					className={styles.usercount}
					title="User count"
					value={data["User count"]}
					icon={Users}
				/>
				<Widget
					className={styles.channelcount}
					title="Channel count"
					value={data["Channel count"]}
					icon={MessageCircle}
				/>
				<Widget
					className={styles.rolecount}
					title="Role count"
					value={data["Role count"]}
					icon={Sliders}
				/>
				<Widget
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