"use client";
import Link from "next/link";
import { CSSProperties, Dispatch, FC, MutableRefObject, Ref, SetStateAction, useEffect, useRef, useState } from "react"

import styles from './navbar.module.css';
import { type NavigationContent, type NavbarCategories, NavbarData } from "./EDITME_navbar_contents";
import Image from "next/image";
import { FocusOn, InFocusGuard } from "react-focus-on";
import VisuallyHidden from "../VisuallyHidden";

export default function Navbar() {
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
			className={styles.main}
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
				href='/'
				className={styles.homeLink}
			>
				Miza
			</Link>
			<div className={styles.spacer} />
			{NavbarData.map((category, index) => (
				<button
					key={category.title}
					className={[
						styles.categoryName,
						activeCategory[0] === category.title && styles.activeCategory
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
			
			<div
				className={[
					styles.categoriesHolder,
					activeCategory[0] ? styles.in : styles.out
				].filter(e => !!e).join(' ')}
				aria-hidden={!activeCategory[0]}
			>
				<FocusOn
					enabled={!!activeCategory[0]}
					className={styles.transformWrap}
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

export const NavbarCategoryHolder: FC<{
	category: {
		title: NavbarCategories,
		items: NavigationContent[]
	},
	mapIndex: number,
	activeCategory: [NavbarCategories | null, number, boolean],
	parentButton: HTMLElement | null,
	setCategory: Dispatch<SetStateAction<[NavbarCategories | null, number, boolean]>>
}> = ({ category, mapIndex, activeCategory, setCategory, parentButton }) => {

	return (
		<ul
			className={[
				!activeCategory[0] || (mapIndex !== activeCategory[1]) ? styles.inert : undefined,
				styles.itemsHolder
			].filter(e => !!e).join(' ')}
			aria-hidden={!activeCategory[0] || mapIndex !== activeCategory[1]}
			tabIndex={(!activeCategory[0] || mapIndex !== activeCategory[1]) ? -1 : undefined}
		>
			{
				category.items.map((item) => (
					<NavbarSubItem
						data={item}
						key={item.title}
						gradient={item.placeholderGradient}
						inert={(!activeCategory[0] || mapIndex !== activeCategory[1])}
					/>
				))
			}
			<VisuallyHidden
				as="button"
				onClick={() => {
					setCategory([null, activeCategory[1], false])
					setTimeout(() => {
						if (parentButton) {
							parentButton.focus();
						}
					}, 2)
				}}
				className={!activeCategory[0] || (mapIndex !== activeCategory[1]) ? styles.inert : undefined}
				aria-hidden={!activeCategory[0] || mapIndex !== activeCategory[1]}
				tabIndex={(!activeCategory[0] || mapIndex !== activeCategory[1]) ? -1 : undefined}
			>
				Close category and return focus to navbar
			</VisuallyHidden>
		</ul>
	)
}

export const NavbarSubItem: FC<{
	data: NavigationContent,
	gradient: number,
	inert: boolean
}> = ({ data, gradient, inert }) => {
	const LinkElem = data.isInternal ? Link : 'a';
	const IconElem = data.icon;

	return (
		<li className={styles.item}>
			<LinkElem
				href={data.href}
				className={[
					inert ? styles.inert : undefined,
					styles.navLinkElem
				].filter(e => !!e).join(' ')}
				aria-hidden={inert}
				tabIndex={inert ? -1 : undefined}
			>
				<div className={styles.navLinkImgHolder}>
					{
						data.img ?
							(
								typeof data.img === 'string' ?
									<img
										src={data.img}
										className={styles.navLinkImg}
										draggable={false}
										alt=""
									/> :
									<Image
										className={styles.navLinkImg}
										src={data.img}
										alt=""
										fill
									/>
							) :
							<div
								className={`${styles.navLinkImg} ${styles.navPlaceholder}`}
								style={{
									'--grad': `var(--gradient-${gradient})`,
									'--debug-navtitle': data.title
								} as CSSProperties}
							>
								<IconElem size={50} color="black" />
							</div>
					}
				</div>
				<div className={styles.align}>
					<div className={styles.left}>
						<IconElem color={data.iconColor} fill={data.iconColor} fillOpacity={0.1} size={30} />
					</div>
					<div className={styles.right}>
						<h3 className={styles.itemTitle}>{data.title}</h3>
						<h4 className={styles.itemSubtitle}>{data.subtitle}</h4>
					</div>
				</div>
			</LinkElem>
		</li>
	)
}