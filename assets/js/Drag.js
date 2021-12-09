/**
 * myDrag
 * 
 */
"use strict";
const DEFAULT_OPTIONS = {
    //called when the drag action starts
    start: function (e) {
        return true
    },
    //called when the drag action is moving 
    move: function (e) { },
    //called when the drag action ends
    end: function (e) { },
    //moveTarget must be a dom object
    moveTarget: undefined,
}
let ALL_DRAGGERS = [];

class MyDragger {
    constructor(inOptions, dom) {
        let options = Object.assign({}, DEFAULT_OPTIONS, inOptions);
        let _moveTarget = (!options['moveTarget']) ? dom : options['moveTarget'];
        let prox = new Proxy(this, {
            set: function (target, key, value) {
                let caller = this.set.caller;
                if (MyDragger.prototype.indexOf(caller) < 0) {
                    throw "Can not set a dragger's property through a function that doesn't belong to the MyDragger's prototype";
                }
                this[key] = value;
                target[key] = value;
            },
        });
        Object.assign(this, {
            indexX: 0,
            indexY: 0,
            mousedownDrag: false,
            options,
            dom,
            _moveTarget,
            handlers: {
                mousemoveHandler: this.wrapEventHandler('mousemoveHandler'),
                mouseupHandler: this.wrapEventHandler('mouseupHandler'),
                mousedownHandler: this.wrapEventHandler('mousedownHandler'),
            }
        });
        _moveTarget.addEventListener('mousemove', this.handlers.mousemoveHandler);
        _moveTarget.addEventListener('touchmove', this.handlers.mousemoveHandler);
        // _moveTarget[0].addEventListener('mouseout',mouseupHandler)
        dom.addEventListener('mousedown', this.handlers.mousedownHandler);
        dom.addEventListener('touchstart', this.handlers.mousedownHandler);
        ALL_DRAGGERS.push(this);
        return prox;
    }
    wrapEventHandler(name) {
        if (typeof this[name] != 'function') {
            return undefined;
        };
        let _this = this;
        return (event) => {
            _this[name](event);
        }
    }
    mousedownHandler(e) {
        let options = this.options;
        processEvent(e);
        if (options['start'].call(this.dom, e) == false) {
            return true;
        }
        this.mousedownDrag = true;
        this.indexX = e.pageX;
        this.indexY = e.pageY;
    }

    mouseupHandler(e) {
        let { mousedownDrag, _moveTarget, options, dom } = this;
        if (mousedownDrag == false) {
            return true;
        }
        //mouseout 到 moveTarget 外部
        if (e.type == 'mouseout' && _moveTarget[0] != e.relatedTarget && _moveTarget.contains(e.relatedTarget)) {
            return true;
        }
        //冒泡事件
        processEvent(e);
        options['end'].call(dom, e);
        this.mousedownDrag = false;
    }

    mousemoveHandler(e) {
        let { mousedownDrag, _moveTarget, options, dom, indexX, indexY } = this;
        if (mousedownDrag == false) {
            return true;
        }
        processEvent(e);
        e.myDragX = e.pageX - indexX;
        e.myDragY = e.pageY - indexY;
        options['move'].call(dom, e);
        this.indexX = e.pageX;
        this.indexY = e.pageY;
    }

    destroy() {
        let index = ALL_DRAGGERS.indexOf(this);
        ALL_DRAGGERS.splice(index, 1);
        let { mousemoveHandler, mouseupHandler, mousedownHandler } = this.handlers;
        let { _moveTarget, dom } = this;
        dom.removeEventListener('mousedown', mousedownHandler);
        dom.removeEventListener('touchstart', mousedownHandler);
        _moveTarget.removeEventListener('mousemove', mousemoveHandler);
        _moveTarget.removeEventListener('touchmove', mousemoveHandler);
        delete this;
    }
}


function myDrag(inOptions = {}) {
    let draggers = [];
    this.each(function () {
        draggers.push(new MyDragger(inOptions, this));
    });
    return draggers;
}

//处理mobile 事件 将移动端event.targetTouches[0].pageX Y 给 jquery event.pageX Y
function processEvent(e) {
    //非touch事件
    if (typeof TouchEvent != 'function' || !(e instanceof TouchEvent)) {
        return e;
    }
    let _touch = e.targetTouches[0] ? e.targetTouches[0] : e.changedTouches[0];
    e.pageX = _touch.pageX;
    e.pageY = _touch.pageY;
    return e;
};


document.addEventListener("mouseup", function (e) {
    for (let i = 0; i < ALL_DRAGGERS.length; i++) {
        let dragger = ALL_DRAGGERS[i];
        dragger.handlers.mouseupHandler(e);
    }
});
document.addEventListener("mouseout", function (e) {
    for (let i = 0; i < ALL_DRAGGERS.length; i++) {
        let dragger = ALL_DRAGGERS[i];
        dragger.handlers.mouseupHandler(e);
    }
});

export default myDrag;