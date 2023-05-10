import cn from "@/lib/cn";
import { ThemeVars } from "@/lib/theme";
import { CSSProperties, FC, useId } from "react";
import { Activity } from "react-feather";
import styles from './timevis.module.css';


//TODO: ORANGE FOR SLOW TIMES
const TimeVisualization: FC<{
    className?: string,
    generalLabel: string,
    ms: number
}> = ({ className, generalLabel, ms }) => {
    const id = useId();
    return (
        <div className={cn(styles.main, className)}
        style={{
            '--delay': ms
        } as CSSProperties}>
            <div className={styles.left}>
                <label htmlFor={id}>{generalLabel}</label>
                <strong id={id}>{ms}ms</strong>
            </div>
            <div className={styles.right}>
                <Activity color={ThemeVars.gray_050} size={20}/>
            </div>
            <svg
                className={styles.pulseTrack}
                viewBox="0 0 100 7"
                preserveAspectRatio="none"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="0"
                    x2="100"
                    y1="5"
                    y2="5"
                    stroke="var(--gray-900)"
                    strokeWidth="7"
                />
                <line
                    x1="0"
                    x2="100"
                    y1="5"
                    y2="5"
                    stroke="var(--gray-100)"
                    strokeWidth="7"
                    className={styles.path}
                    pathLength="1"
                />
            </svg>
            <svg
                className={cn(styles.pulseTrack, styles.top)}
                viewBox="0 0 100 7"
                preserveAspectRatio="none"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="0"
                    x2="100"
                    y1="5"
                    y2="5"
                    stroke="var(--gray-900)"
                    strokeWidth="7"
                />
                <line
                    x1="0"
                    x2="100"
                    y1="5"
                    y2="5"
                    stroke="var(--gray-100)"
                    strokeWidth="7"
                    className={styles.path}
                    pathLength="1"
                />
            </svg>
        </div>
    )
}

export default TimeVisualization;