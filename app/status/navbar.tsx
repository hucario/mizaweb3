"use client";
import Link from "next/link";
import { FC,  PropsWithChildren, useEffect, useRef, useState } from "react"

import navstyles from '@/c/navbar/navbar.module.css';
import statusstyles from './statuspage.module.css';

import { type NavbarCategories, NavbarData } from "@/c/navbar/EDITME_navbar_contents";
import { FocusOn } from "react-focus-on";
import { NavbarCategoryHolder } from "@/c/navbar/navbar";


const Navbar: FC<PropsWithChildren> = ({ children }) => {
	// Current real category, cached transform, is hover?
	const [activeCategory, setCategory] = useState<[NavbarCategories | null, number, boolean]>([null, 1, false]);
	const downIsHovered = useRef(false);

	const toggleCategory = (title: NavbarCategories, index: number) => {
		if (activeCategory && activeCategory[0] === title && !activeCategory[2]) {
			setCategory([null, activeCategory[1], false]);
		} else {
			setCategory([title, index, false]);
		}
	}

	const hoverShow = (title: NavbarCategories, index: number) => {
		if (activeCategory && activeCategory[0] && !activeCategory[2]) {
			return;
		} else {
			setCategory([title, index, true]);
		}
	}


	const buttonRefs = useRef<Map<string, HTMLElement | null>>(new Map());

	useEffect(() => {
		const listener = (ev: KeyboardEvent) => {
			if (activeCategory[0] && ev.key === 'Escape') {
				setCategory([null, activeCategory[1], false]);
				setTimeout(() => {
					let parentButton = buttonRefs.current?.get(activeCategory[0] ?? '') ?? null;
					if (parentButton) {
						parentButton.focus();
					}
				}, 2)
			}
		}
		document.addEventListener('keydown', listener);

		return () => {
			document.removeEventListener('keydown', listener);
		}
	}, [activeCategory, setCategory])

	return (
		<nav
			className={statusstyles.analyticsNav}
			onMouseOver={() => downIsHovered.current = true}
			onMouseOut={() => {
				downIsHovered.current = false;
				if (activeCategory[2]) {
					setTimeout(() => {
						if (!downIsHovered.current && activeCategory[2]) {
							setCategory([null, activeCategory[1], false]);
						}
					}, 250)
				}
			}}
		>
			<Link
				href='/status'
				className={statusstyles.mainLink}
			>
				MizAnalytics
			</Link>
			<div className={statusstyles.spacer} />
			{children}
			<div className={statusstyles.spacer} />
			<div className={statusstyles.buttons}>
				{NavbarData.map((category, index) => (
					<button
						key={category.title}
						className={[
							navstyles.categoryName,
							activeCategory[0] === category.title && navstyles.activeCategory
						].filter(e => !!e).join(' ')}
						onClick={() => toggleCategory(category.title, index)}
						onMouseOver={() => hoverShow(category.title, index)}
						ref={(r) => {
							buttonRefs.current?.set(category.title, r);
						}}
					>
						{category.title}
					</button>
				))}
			</div>
			
			<div
				className={[
					statusstyles.categoriesHolder,
					activeCategory[0] ? navstyles.in : navstyles.out
				].filter(e => !!e).join(' ')}
				aria-hidden={!activeCategory[0]}
			>
				<FocusOn
					enabled={!!activeCategory[0]}
					className={navstyles.transformWrap}
					style={{
						transform: `translateX(-${activeCategory[1] * 100}%)`
					}}
					noIsolation
				>
					{NavbarData.map((category, mapIndex) => (
						<NavbarCategoryHolder
							key={category.title}
							category={category}
							mapIndex={mapIndex}
							activeCategory={activeCategory}
							setCategory={setCategory}
							parentButton={buttonRefs.current?.get(category.title) ?? null}
						/>
					))}
				</FocusOn>
			</div>
		</nav>
	)
}

export default Navbar;