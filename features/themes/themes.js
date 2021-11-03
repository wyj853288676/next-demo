const colorTags = [
    'color', 'background', 'sell', 'buy'
];
const RgbaColor = require("@/assets/js/RgbaColor");
/**
 * Attention: 
 *  The color string you set, like "#555", will be converted by <color-rgba> 
 *  */
var themes = [
    // default
    {
        name: 'Light',
        colorList: {
            color: {
                title: 'text',
                main: '#555',
                vice: '#409EFF',
            },
            background: {
                title: 'bg',
                main: "rgb(245 247 250)",
                vice: "white",
            },
            sell: {
                main: 'rgb(255, 39, 75)',
            },
            buy: {
                main: 'rgb(1, 195, 141)',
            },
        },
    },
    //dark
    {
        name: 'Dark',
        colorList: {
            color: {
                title: 'text',
                main: 'white',
                // vice: 'rgba(231,202,135,1)',
                vice: '#dab866',
            },
            background: {
                title: 'bg',
                main: "rgb(45 45 45)",
                vice: "#3b3b3b",
            },
            sell: {
                main: 'rgb(255, 39, 75)',
                // main: "#409EFF",
            },
            buy: {
                main: 'rgb(1, 195, 141)',
                // main: "#a3cbf4",
            },
        },
    }
];
let colorNames = ["main", "vice"];
//fix themes' colorList
for (var i = 0; i < themes.length; i++) {
    var colorList = themes[i].colorList;
    for (var j = 0; j < colorTags.length; j++) {
        var colorType = colorTags[j];
        if (colorList[colorType] === undefined) {
            colorList[colorType] = {};
        } else {
            for (let count = 0; count < colorNames.length; count++) {
                if (!colorList[colorType][colorNames[count]]) {
                    continue;
                }
                colorList[colorType][colorNames[count]] = new RgbaColor(colorList[colorType][colorNames[count]]);
            }
        }
    };

}
export { colorTags, themes };
