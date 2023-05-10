const range = (start: number, end?: number, step = 1) => {
	if (typeof end === "undefined") {
		end = start;
		start = 0;
	}
	end = end as number;
	let therange = end - start;
	let output = [];
	for (let i = 0; i <= therange; i += step) {
		output.push(i - Math.abs(start));
	}
	return output;
};

export default range;