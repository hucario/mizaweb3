"use client";

import { FC, useEffect, useRef, useState } from "react";

import styles from './scrolllinks.module.css';

export type ScrollLink = {
	title: string;
	elemId: string;
}

let innerDimensions = (node: HTMLElement) => {
	var computedStyle = getComputedStyle(node)

	let width = node.clientWidth // width with padding
	let height = node.clientHeight // height with padding

	height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
	width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
	return { height, width }
}

function mapNum(pad: boolean, num: number, offsets: number[], linkOffsets: number[], maxWidth: number) {
	let scrollTopMax = Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight;
	
	let elemIndex = offsets.findLastIndex(seg => (num > seg));
	let elemStart = offsets[elemIndex] ?? 0;
	let elemEnd = offsets[elemIndex + 1] ?? scrollTopMax + window.innerHeight;
	let elemHeight = elemEnd - elemStart;

	let linkStart = linkOffsets[elemIndex] ?? 0;
	let linkEnd = linkOffsets[elemIndex + 1] ?? maxWidth;
	let linkWidth = linkEnd - linkStart;
	let offsetNum = pad ? num + (offsets[0]/2) : num;
	let pctThroughElem = (offsetNum - elemStart) / elemHeight;
	let effectiveNum = linkStart + (pctThroughElem * linkWidth);

	return Math.max(effectiveNum, linkOffsets[0]);
}
  
const ScrollLinks: FC<{
	links: ScrollLink[]
}> = ({ links }) => {
	const bgRef = useRef<HTMLDivElement | null>(null);
	const linkRefs = useRef<Map<string, HTMLElement | null>>(new Map());

	const [offsets, setOffsets] = useState(typeof window === 'undefined' ?
		() => links.map(() => 0) :
		() => links.map(link => 
			Math.round(
				(document.getElementById(link.elemId)?.getBoundingClientRect?.()?.top ?? 0)
				+ window.scrollY
			)
		)
	);
	const [linkOffsets, setLinkOffsets] = useState(
		() => (
			links.map(link => linkRefs.current.get(link.elemId)?.offsetLeft ?? 0)
		)
	);

	function setBGPos(x1: number, x2: number) {
		bgRef.current!.style.setProperty('--width', `${x2 - x1}px`)
		bgRef.current!.style.setProperty('--left', `${x1}px`)
	}

	useEffect(() => {
		const listener = () => {
			setOffsets(links.map(link => 
				Math.round(
					document.getElementById(link.elemId)!.getBoundingClientRect().top
					+ window.scrollY
				)
			));
			setLinkOffsets(links.map(link => (
				linkRefs.current.get(link.elemId)?.offsetLeft ?? 0
			)));
		}
		listener();
		window.addEventListener('resize', listener, { passive: true });
		document.documentElement.classList.add(styles.scroll);
		return () => {
			document.documentElement.classList.remove(styles.scroll);
			window.removeEventListener('resize', listener);
		}
	}, [])


	useEffect(() => {
		let lastSeg: number;
		const listener = () => {
			let maxLinkOffset = innerDimensions(bgRef.current!.parentElement!).width + 6;
			let currSeg = offsets.findLastIndex(
				(seg) => (
					document.documentElement.scrollTop + (window.innerHeight/2) >= seg
				)
			);
			if (currSeg === -1) {
				currSeg = 0;
			}

			if (lastSeg !== currSeg) {
				if (lastSeg !== undefined) {
					for (let elem of linkRefs.current.values()) {
						elem?.classList.remove(styles.active);
					}
				}
				linkRefs.current!.get(links[currSeg]?.elemId ?? '')?.classList.add(styles.active);
			}
			setBGPos(
				mapNum(
					true,
					document.documentElement.scrollTop,
					offsets,
					linkOffsets,
					maxLinkOffset
				),
				mapNum(
					false,
					document.documentElement.scrollTop + window.innerHeight,
					offsets,
					linkOffsets,
					maxLinkOffset
				)
			)
			lastSeg = currSeg;
		}
		listener();
		document.addEventListener('scroll', listener, {passive: true});
		return () => {
			document.removeEventListener('scroll', listener);
		}
	}, [offsets, linkOffsets])

	return (
		<div className={styles.main}>
			<div className={styles.bgElem} ref={bgRef} />
			{
				links.map(link => (
					<a href={`#${link.elemId}`} key={link.elemId} ref={(ref) => {
						linkRefs.current.set(link.elemId, ref);
					}}>
						{link.title}
					</a>
				))
			}
		</div>
	)
}

export default ScrollLinks;