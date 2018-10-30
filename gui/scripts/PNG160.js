

class CRC {
    static createTable32() {
        CRC.TABLE32 = new Uint32Array(256);
        for (let i = 256; i--;) {
            let tmp = i;

            for (let k = 8; k--;) {
                tmp = tmp & 1 ? 3988292384 ^ tmp >>> 1 : tmp >>> 1;
            }
            CRC.TABLE32[i] = tmp;
        }
    }

    static crc32(data) {
        if (!CRC.TABLE32) { CRC.createTable32() }

        let crc = -1; // Begin with all bits set ( 0xffffffff )
        for (let i = 0, l = data.length; i < l; i++) {
            crc = crc >>> 8 ^ CRC.TABLE32[crc & 255 ^ data[i]];
        }
        return (crc ^ -1) >>> 0; // Apply binary NOT
    }
}

class PNG160 {

    //VERY LIKELY TO HAVE PROBLEMS WITH THIRD PARTY IMAGES!
    //TODO: change IDAT size after edit
    static readPixelsOfPNG(pngdata,read, options) {
        options = options || {}
        let data = options.override ? pngdata.slice() : pngdata

        if (isPng(data)) {
            let index = PNG160.PNG_HEADER.length;
            //PNG properties from IHDR:
            let width, height, bitdepth, colortype, filterType;

            //Read file
            while (index < data.length) {
                let dataLength = bytesToInt32(data, index, index + 4);
                let chunktype = bytesToInt32(data, index + 4, index + 8);
                // console.log(chunklength, chunktype);

                if (bitdepth && bitdepth != 16 && colortype != 0) {
                    console.log("INCORRECT FORMAT");
                    break;
                }

                switch (chunktype) {
                    case bytesToInt32(PNG160.IHDR):
                        width = bytesToInt32(data, index + 8, index + 12);
                        height = bytesToInt32(data, index + 12, index + 16);
                        bitdepth = data[index + 16];
                        colortype = data[index + 17];
                        filterType = data[index + 19]
                        break;
                    case bytesToInt32(PNG160.IDAT):
                        let deflatedData = data.subarray(index + 8, index + 8 + dataLength);
                        let imagedata = pako.inflate(deflatedData);


                        //Undo existing filters:
                        let linefilter = 0, lineindex = 0, imageIndex = 0;
                        for (let i = 0; i < (height + 1) * width; i++) {
                            if (i % (1 + width)) {
                                switch (linefilter) {
                                    case 0: //Nothing filter
                                        break;
                                    case 1: // Sub
                                        if (lineindex != 0) {
                                            imagedata[imageIndex] += imagedata[imageIndex - 2]
                                            imagedata[imageIndex + 1] += imagedata[imageIndex + 1 - 2]
                                        }
                                        break;
                                    case 2: // Up
                                        imagedata[imageIndex] += imagedata[imageIndex - ((width * 2) + 1)]
                                        imagedata[imageIndex + 1] += imagedata[imageIndex + 1 - ((width * 2) + 1)]
                                        break;
                                    case 3: //Average
                                        imagedata[imageIndex] += Math.floor((imagedata[imageIndex - 2] + imagedata[imageIndex - ((width * 2) + 1)]) / 2);
                                        imagedata[imageIndex + 1] += Math.floor((imagedata[imageIndex + 1 - 2] + imagedata[imageIndex + 1 - ((width * 2) + 1)]) / 2);
                                        break;
                                    default:
                                        console.log("Filter unhandled" + linefilter);
                                        break;
                                }
                                
                                read(width, i - 1 - ((i / (width+1)) >> 0), bytesToInt16(imagedata,imageIndex))
                                imageIndex += 2;
                                lineindex++;
                            } else {
                                
                                linefilter = imagedata[imageIndex];
                                imagedata[imageIndex] = 0x00;
                                imageIndex++;
                                lineindex = 0;
                            }
                        }

                        let recompressed = pako.deflate(imagedata, { level: 0, windowBits: 8, strategy: 1 })
                        for (let i = index + 8; i < index + 8 + recompressed.length; i++) {
                            data[i] = recompressed[i - (index + 8)];
                        }
                        break;
                    case bytesToInt32(PNG160.IEND):
                        break;
                    default:
                        let charcode = new TextDecoder("utf-8").decode(getInt32Bytes(chunktype).buffer);
                        let hexcode = tohex(getInt32Bytes(chunktype))
                        console.log("Unprocced chunk -> charcode: " + charcode + " hexcode: " + hexcode);
                        break;
                }



                index += (12 + dataLength); //Move on to next block
            }
        }

        //Helper methods
        function isPng(data) {
            let ispng = true;
            data.subarray(0, 8).forEach((byte, i) => { ispng = byte == PNG160.PNG_HEADER[i] ? ispng : false });
            return ispng;
        }
    }
    static createPNG(height, width, dataputter) {
        //Add png header
        let tempdata = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
        tempdata.pushAll = (array, values) => {
            values.forEach(v => {
                array.push(v);
            });
        }

        //--------------------------------------------
        //-----------------IHDR-----------------------
        //--------------------------------------------
        tempdata.pushAll(tempdata, getInt32Bytes(13)); //Length
        tempdata.pushAll(tempdata, PNG160.IHDR); //Chunk type
        tempdata.pushAll(tempdata, getInt32Bytes(width));
        tempdata.pushAll(tempdata, getInt32Bytes(height));
        tempdata.push(0x10) // bit depth
        tempdata.push(0x0) // color type
        tempdata.push(0x0) // compression method
        tempdata.push(0x0) // filter method
        tempdata.push(0x0) // interlace method
        tempdata.pushAll(tempdata, getInt32Bytes(CRC.crc32(tempdata.slice(12, 29)))) //CRC

        //--------------------------------------------
        //-----------------IDAT-----------------------
        //--------------------------------------------
        //Create data
        let imagedata = new Uint8Array(height * width * 2 + height);
        let imageindex = 0;
        for (let i = 0; i < (height + 1) * width; i++) {
            if (i % (1 + width)) {
                let value = getInt16Bytes(dataputter(width, height, i - 1 - ((i / (width+1)) >> 0)));
                imagedata[imageindex++] = value[0];
                imagedata[imageindex++] = value[1];
            } else {
                imagedata[imageindex++] = 0;
            }
        }
        let compressed = pako.deflate(imagedata, { level: 9, windowBits: 8, strategy: 1 })

        //Create chunk
        tempdata.pushAll(tempdata, getInt32Bytes(compressed.length)); //Length
        tempdata.pushAll(tempdata, PNG160.IDAT);//Chunk type
        tempdata.pushAll(tempdata, compressed); //Data
        tempdata.pushAll(tempdata, getInt32Bytes(CRC.crc32(tempdata.slice(37, 41 + compressed.length)))) //CRC

        //--------------------------------------------
        //-----------------IEND-----------------------
        //--------------------------------------------

        tempdata.pushAll(tempdata, getInt32Bytes(0)); //Length
        tempdata.pushAll(tempdata, PNG160.IEND); //Chunk type
        tempdata.pushAll(tempdata, [0xAE, 0x42, 0x60, 0x82]) //CRC
        return new Uint8Array(tempdata);
    }

    static get IHDR() {
        return new Uint8Array([0x49, 0x48, 0x44, 0x52])
    }

    static get IDAT() {
        return new Uint8Array([0x49, 0x44, 0x41, 0x54])
    }

    static get IEND() {
        return new Uint8Array([0x49, 0x45, 0x4E, 0x44])
    }

    static get PNG_HEADER() {
        return new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    }
}

//Helper methods
function getInt32Bytes(x) {
    var bytes = [];

    for (let i = 3; i >= 0; i--) {
        bytes[i] = x & (255);
        x = x >> 8;
    }
    return new Uint8Array(bytes);
}

function bytesToInt32(data, start, end) {
    var dataView = new DataView(data.buffer.slice(start, end));
    return dataView.getUint32(0);
}

function tohex(input) {
    let temp = "";
    input.forEach(element => {
        let hex = element.toString(16);
        if (hex.length == 1) {
            hex = "0" + hex;
        }
        temp += hex + " ";
    });
    temp.trim();
    return temp;
}

function bytesToInt16(data, start) {
    return data[start]*256 + data[start+1];
}

function getInt16Bytes(x) {
    var bytes = [];

    for (let i = 1; i >= 0; i--) {
        bytes[i] = x & (255);
        x = x >> 8;
    }
    return new Uint8Array(bytes);
}


