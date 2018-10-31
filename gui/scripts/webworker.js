
            var max = 390;
            var min = -1110;
onmessage = function (e) {
    importScripts("PNG160.js")
    importScripts("../libs/pako_inflate.min.js")
    importScripts("../libs/pako_deflate.min.js")
    importScripts("../libs/pako.min.js")
    console.log('WORKER:', 'Message received from main script', e);

    const lerp = (num, in_min, in_max, out_min, out_max) => {
        lerped = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;

        if (lerped < out_min || lerped > out_max) {
            return Math.max(Math.min(lerped, out_max), out_min)
        }


        return lerped;
    }

    let pngdata = PNG160.createPNG(e.data[1] + 1, e.data[1] + 1, (w, h, i) => {
        if (i % 100000 == 0) {
            console.log("Progress:", (i / ((e.data[1] + 1) * (e.data[1] + 1)) * 100) + "%");
        }
        return lerp(e.data[0][i], max, min, 0, 65535);
    })


    postMessage(pngdata);
}





