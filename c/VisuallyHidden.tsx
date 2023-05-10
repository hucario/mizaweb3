import { FC, PropsWithChildren, useEffect, useState, ReactElement, ComponentType, CSSProperties, ElementType, ComponentPropsWithoutRef } from "react";

const hiddenStyles = {
    display: 'inline-block',
    position: 'absolute',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    height: 1,
    width: 1,
    margin: -1,
    padding: 0,
    border: 0,
} as const;



type PolymorphicAsProp<E extends ElementType> = {
  as?: E;
};

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E>
  & PolymorphicAsProp<E>
>;

const defaultElement = "span";

function VisuallyHidden<E extends ElementType = typeof defaultElement>({
	as,
	children,
	className,
	...delegated
}: PolymorphicProps<E>) {
	const [forceShow, setForceShow] = useState(false);
	const Tag = as ?? defaultElement;
	useEffect(() => {
		if (process.env.NODE_ENV !== 'production') {
			const handleKeyDown = (ev: KeyboardEvent) => {
				if (ev.key === 'Control') {
					setForceShow(true);
				}
			};
			const handleKeyUp = (ev: KeyboardEvent) => {
				if (ev.key === 'Control') {
					setForceShow(false);
				}
			};
			window.addEventListener('keydown', handleKeyDown);
			window.addEventListener('keyup', handleKeyUp);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
				window.removeEventListener('keyup', handleKeyUp);
			};
		}
	}, []);
	if (forceShow) {
		return (<Tag {...delegated}>
			{children}
		</Tag>);
	}
	return (
		<Tag style={hiddenStyles} {...delegated}>
			{children}
		</Tag>
	);
};
export default VisuallyHidden;