const convert = require("color-rgba");
const Color = require("color");

class RgbaColor extends String {
    constructor(str) {
        super(str);
        this.value = convert(str);
        let { 0: r, 1: g, 2: b, 3: a } = this.value;
        Object.assign(this, { r, g, b, a });
        this.color = Color(this.toString());
        return this;
    }
    toString() {
        return `rgba(${this.value.join(',')})`;
    }
    setOpacity(opacity) {
        return new RgbaColor(`rgba(${[this.r, this.g, this.b, opacity].join(',')})`);
    }
    saturation(saturation) {
        let hsl = this.getHSL();
        hsl.color[1] = saturation / 100;
        return hsl;
    }
    light(light) {
        return this.getHSL().lightness(light)
    }
    getHSL() {
        return this.color.hsl();
    }

}

module.exports = RgbaColor;