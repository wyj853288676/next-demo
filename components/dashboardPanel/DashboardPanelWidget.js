import { Matrix } from "@/assets/js/Matrix";
const hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getUniqueId = () => {
    var s = [];
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = "4"
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = "-"
    let uuid = s.join("") + "-" + Date.now();
    return uuid;
};


class DashboardPanel {
    constructor(options = {}) {
        let defaultOptions = {
            name: "dashboard-panel",
            dimension: {
                dimensionCol: Infinity,
                dimensionRow: Infinity,
            },
            x: 0,
            y: 0,
            lengthRow: 1,
            lengthCol: 1,
            /**  
            * if you set <min/max><Col/Row> as a function, 
            * it will get a vueComponent param(Dashboard.vue)
            * which contains the dimensionX and dimensionY and you need to return a number.
             */
            minCol: 1,
            minRow: 1,
            maxCol: Infinity,
            maxRow: Infinity,
            //0 available; 1 used && root; 2: used && !root;
            status: 1,
            sizeOffsetX: 0,
            sizeOffsetY: 0,
            //the obj of the widget vue component, <name> is necessary
            widget: null,
            //panel is "display:none" or not
            hidding: false,


            //panel is closable or not
            closable: true,
            //panel is resizable or not
            resizeable: true,
            //panel can be dragged or not
            draggable: true,
            //panel is popoutable or not
            popoutable: true,
            //panel is configurable or not
            configurable: false,

            //panel is resizing
            resizing: false,
            //panel is dragging or not
            dragging: false,
            //panel is poppingout or not
            poppingout: false,
            key: Math.random() + "-" + new Date().getTime(),
        };
        let constOptions = {
            transform: new Matrix(),
            resizeDirection: "right-down", // left right up down
            _id: getUniqueId(),
        };
        if (!options.key) {
            constOptions.key = defaultOptions.key;
        }
        if (options.widget && typeof options.widget != 'object') {
            options.widget = {
                name: options.widget,
            }
        }
        Object.assign(this, defaultOptions, options, constOptions);

        return new Proxy(this, {
            set(target, key, value, receiver) {
                switch (key) {
                    case "status":
                        return statusProxy(target, value, receiver);
                    case "transform":
                        return transformProxy(target, value, receiver);
                    default:
                        return Reflect.set(target, key, value, receiver);
                }
            },
            get(target, key, receiver) {
                if (['maxRow', "minRow", "maxCol", "minCol", "lengthRow", "lengthCol"].indexOf(key) >= 0) {
                    return sizeLimitProxy(target, key, receiver);
                }
                return Reflect.get(target, key);
            }
        });

    }
    copy() {
        let {
            status,
            sizeOffsetX,
            sizeOffsetY,
            //panel is resizing
            resizing,
            //panel is dragging or not
            dragging,
            transform
        } = this;
        return {
            status,
            sizeOffsetX,
            sizeOffsetY,
            //panel is resizing
            resizing,
            //panel is dragging or not
            dragging,
            transform
        };
    }
}

function sizeLimitProxy(target, key, receiver) {
    if (typeof target[key] === "function") {
        return target[key](target.dimension);
    } else if (["maxRow", "maxCol"].indexOf(key) >= 0) {
        return key == "maxRow" ? Math.min(target.dimension.dimensionRow || Infinity, target.maxRow) : Math.min(target.dimension.dimensionCol || Infinity, target.maxCol);
    } else {
        return target[key];
    }
}


function transformProxy(target, value, receiver) {
    if (!value instanceof Matrix) {
        throw new Error(`the transform property must be an instance of Matrix`);
    }
    return Reflect.set(target, "transform", value, receiver);
}

function statusProxy(target, value, receiver) {
    let codes = Object.values(DashboardPanel.statusCode);
    if (codes.indexOf(value) < 0) {
        throw new Error(`the status of a DashboardPanel instance must be one of ${codes.join(' ')}`);
    }
    return Reflect.set(target, 'status', value, receiver);
}

const propertiesToSave = [
    "key",
    "name",
    "x", "y",
    "lengthCol", "lengthRow",
    "widget",
    "poppingout",
];

DashboardPanel.prototype.toJSON = function () {
    let data = {};
    for (let i = 0; i < propertiesToSave.length; i++) {
        let propName = propertiesToSave[i];
        data[propName] = this[propName];
    }
    return data;
}

DashboardPanel.PROPERTIES_TO_SAVE = propertiesToSave;

Object.defineProperty(DashboardPanel, "statusCode", {
    writable: false,
    value: {
        DEFAULT: 0,
        DRAGGING: 1,
        RESIZING: 2,
    },
});

export default DashboardPanel;