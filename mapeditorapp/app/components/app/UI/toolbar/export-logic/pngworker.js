import { PNG160 } from "./libs/PNG160.js";

self.onmessage = function(e) {
	postMessage(["Start", "Starting"]);

	let onepercent = (((e.data[1] + 1) * (e.data[1] + 1)) / 100) >> 0;
	let pngdata = PNG160.createPNG(e.data[1] + 1, e.data[1] + 1, (w, h, i) => {
		if (i % onepercent == 0) {
			if (i / onepercent == 100) {
				postMessage(["Finished", "Finishing..."]);
			} else {
				postMessage(["Progress", "Progress", i / onepercent]);
			}
		}
		return e.data[0][i];
	});
	postMessage(["Finished", "Finished"]);
	postMessage(["Data", pngdata]);
};
