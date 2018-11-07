import { Tool, Options, Option } from "./tools";

let strengthOption = new Option("strength", 5);
let sizeOption = new Option("size", 5, 1);
let raiseTool = new Tool("square", null, new Options([strengthOption], [sizeOption]));

let averageTool = new Tool("", { brushscaler: averageBrush, tooling: average }, new Options([], [sizeOption.copy()]));

function average(tool, toolableVertices) {
	let tv = toolableVertices;
	tool.iterateBrush((x, y, strength) => {
		if (strength > 0) {
			let average =
				(tv[y - 1][x - 1].height +
					tv[y - 1][x].height +
					tv[y - 1][x + 1].height +
					tv[y][x - 1].height +
					tv[y][x].height +
					tv[y][x + 1].height +
					tv[y + 1][x - 1].height +
					tv[y + 1][x].height +
					tv[y + 1][x + 1].height) /
				9;

			tv[y][x].height = average;
		}
	});
}

function averageBrush(tool) {
	let size = tool.brushOptions.size.value + 1;
	let brush = [];
	for (let y = 0; y < size; y++) {
		brush[y] = [];
		for (let x = 0; x < size; x++) {
			if (x == 0 || x == size - 1 || y == 0 || y == size - 1) {
				brush[y][x] = 0;
			} else {
				brush[y][x] = 1;
			}
		}
	}
	return brush;
}

export { raiseTool, averageTool };
