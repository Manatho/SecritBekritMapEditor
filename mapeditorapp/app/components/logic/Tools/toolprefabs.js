import { Tool} from "./tools";
import { Controller } from "../controller";
import { Town } from "../TerrainObjects/town";
import { TOWN_SIZE_FACTOR_MIN, TOWN_SIZE_FACTOR_MAX, ListIndustries } from "../constants";
import { Industry } from "../TerrainObjects/industry";
import { NumberOption, Options, TextOption, ChoiceOption } from "./toolOptions";

let strengthOption = new NumberOption("strength", 1);
let sizeOption = new NumberOption("size", 5, 1);
let raiseTool = new Tool("gauss", null, new Options([strengthOption], [sizeOption]));

let averageTool = new Tool("", { brushscaler: averageBrush, tooling: average }, new Options([], [sizeOption.copy()]));

function average(tool, toolableVertices) {
	let tv = toolableVertices;
	tool.iterateBrush((x, y, strength) => {
		if (strength > 0) {
			let val = 0;
			let count = 0;
			for (let xm = -1; xm <= 1; xm++) {
				for (let ym = -1; ym <= 1; ym++) {
					if (tv[y + ym] != null && tv[y + ym][x + xm] != null) {
						val += tv[y + ym][x + xm].height;
					} else {
						count++;
					}
				}
			}

			if (tv[y] != null && tv[y][x] != null) {
				tv[y][x].height = val / (9 - count);
			}
		}
	});
}

function averageBrush(tool) {
	console.log(tool.brushOptions);

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
	console.log(brush);
	return brush;
}

let townNameOption = new TextOption("name", "", "town");
let sizeFactor = new NumberOption("size_factor", 1, TOWN_SIZE_FACTOR_MIN, TOWN_SIZE_FACTOR_MAX, 0.1);
let townTool = new Tool("", { brushscaler: placementBrush, tooling: townplacer }, new Options([townNameOption, sizeFactor], []));
townTool.name = "town";
function placementBrush() {
	return [[1]];
}

let lastTownTool = 0;
function townplacer(tool, toolableVertices) {
	if (lastTownTool + 1000 < Date.now()) {
		if (toolableVertices.length > 0) {
			Controller.addTerrainObject(new Town(tool.toolOptions.name.value, toolableVertices[0][0], tool.toolOptions.size_factor.value));
		}
	}
}

let industryNameOption = new TextOption("name", "", "industry");
let angleOption = new NumberOption("angle", 1, 0, 360, 1);
let industryOption = new ChoiceOption("Industry", ListIndustries());
let industryTool = new Tool("", { brushscaler: placementBrush, tooling: industryPlacer }, new Options([industryNameOption, angleOption, industryOption], []));
industryTool.name = "town";

function industryPlacer(tool, toolableVertices) {
	if (toolableVertices.length > 0) {
		Controller.addTerrainObject(new Industry(tool.toolOptions.name.value, toolableVertices[0][0],"test", 0));
	}
}

export { raiseTool, averageTool, townTool, industryTool };
