

export const rgba2HexATuple = (color) => {
    let rgb = color.split(",");
    let r = parseInt(rgb[0].split("(")[1]);
    let g = parseInt(rgb[1]);
    let b = parseInt(rgb[2]);
    let a = parseFloat(rgb[3].split(")")[0]);
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return [hex, a];
}


export const hex2Rgba = (hex, opacity = 1) => {
    let rgba = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
    return rgba;
}











