/**
 * @license -------------------------------------------------------------------
 *    module: Lanczos Resampling
 *       src: http://blog.yoz.sk/2010/11/lanczos-resampling-with-actionscript/
 * 	   jssrc: https://github.com/mudcube/Lanczos.js/blob/master/index.js
 *   authors: Jozef Chutka
 * copyright: (c) 2009-2010 Jozef Chutka
 *   license: MIT
 * -------------------------------------------------------------------
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var ResampleLanczos = (function() {
	var CACHE;
	var CACHE_PRECISION = 1000;
	var FILTER_SIZE = 1;

	var kernels = {
		lanczos: function(size, x) {
			if (x >= size || x <= -size) return 0;
			if (x === 0) return 1;
			var xpi = x * Math.PI;
			return (size * Math.sin(xpi) * Math.sin(xpi / size)) / (xpi * xpi);
		}
	};

	function createCache(kernel, cachePrecision, filterSize) {
		var cache = {};
		var max = filterSize * filterSize * cachePrecision;
		var iPrecision = 1.0 / cachePrecision;
		var value;
		for (var cacheKey = 0; cacheKey < max; cacheKey++) {
			value = kernel(filterSize, Math.sqrt(cacheKey * iPrecision));
			cache[cacheKey] = value < 0 ? 0 : value;
		}
		return cache;
	}

	var createCanvas = function(width, height) {
		var canvas;
		if (typeof document === "undefined") {
			canvas = new Canvas();
		} else {
			canvas = document.createElement("canvas");
		}
		canvas.ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	};

	return function(data, datawidth, dataheight, scaledWidth, scaledHeight, filterSize) {
		var sdata = data;
		var ddata = new Uint16Array(scaledHeight * scaledWidth);
		///
		var total, distanceY, value;
		var a, r, g, b;
		var i;
		///
		var x, x1, x1b, x1e;
		var y, y1, y1b, y1e, y2, y3;
		var y1et, x1et;
		///
		var values = [];
		var sx = scaledWidth / datawidth;
		var sy = scaledHeight / dataheight;
		var sw1 = datawidth - 1;
		var sh1 = dataheight - 1;
		var isx = 1.0 / sx;
		var isy = 1.0 / sy;
		var cw = 1.0 / scaledWidth;
		var ch = 1.0 / scaledHeight;
		var csx = Math.min(1, sx) * Math.min(1, sx);
		var csy = Math.min(1, sy) * Math.min(1, sy);
		var cx, cy;
		var sourcePixelX, sourcePixelY;
		var cache = (CACHE = undefined);
		var cachePrecision = CACHE_PRECISION;
		var filterSize = filterSize || FILTER_SIZE;

		if (!cache) CACHE = cache = createCache(kernels.lanczos, cachePrecision, filterSize);
		y = scaledHeight;

		while (y--) {
			sourcePixelY = (y + 0.5) * isy;
			y1b = sourcePixelY - filterSize;
			if (y1b < 0) y1b = 0;
			y1e = y1et = sourcePixelY + filterSize;
			if (y1e != y1et) y1e = y1et + 1;
			if (y1e > sh1) y1e = sh1;
			cy = y * ch - sourcePixelY;
			y3 = y * scaledWidth;
			x = scaledWidth;
			while (x--) {
				sourcePixelX = (x + 0.5) * isx;
				x1b = sourcePixelX - filterSize;
				if (x1b < 0) x1b = 0;
				x1e = x1et = sourcePixelX + filterSize;
				if (x1e != x1et) x1e = x1et + 1;
				if (x1e > sw1) x1e = sw1;
				cx = x * cw - sourcePixelX;
				///
				i = total = 0;
				for (y1 = y1b >> 0; y1 <= y1e; y1++) {
					distanceY = (y1 + cy) * (y1 + cy) * csy;
					for (x1 = x1b >> 0; x1 <= x1e; x1++) {
						total += values[i++] = cache[(((x1 + cx) * (x1 + cx) * csx + distanceY) * cachePrecision) >> 0] || 0;
					}
				}
				total = 1.0 / total;
				///
				let idx;
				i = a = r = g = b = 0;
				for (y1 = y1b >> 0; y1 <= y1e; y1++) {
					y2 = y1 * datawidth;
					for (x1 = x1b >> 0; x1 <= x1e; x1++) {
						value = values[i++] * total;
						idx = (y2 + x1) >> 0;
						r += sdata[idx] * value;
					}
				}
				idx = (x + y3) >> 0;
				ddata[idx] = r;
			}
		}
		return ddata;
	};
})();

export { ResampleLanczos };
