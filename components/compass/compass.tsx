
import { useEffect, useMemo, useState } from "react";
import styles from "./compass.module.scss";
import { Matrix3d } from "@/assets/js/Matrix";
import React from "react";
import Decimal from "decimal.js";
class Card {
    constructor(props = {}) {
        Object.assign(this, props, {
            title: "New Card",
            content: "Empty Card",
        });
    }
}

const PRECISION = 2;
const Compass = (props) => {
    const [state, setState] = useState({
        rotateAngle: 0,
        rotateDirection: null, // 1  clock wise -1 : counter clock wise
        scrollEventTriggerTime: 0,
        clickEventTriggerTime: 0,
        minLimit: 6,
        animationRendering: false,
        draggers: [],
        searchTitle: "",
    });
    const contentStyle = {
        perspective: `${props.radius * 4}px`,
        perspectiveOrigin: `50% -150px`,
        height: `${props.radius / 2 + 100}px`,
    }

    //computed
    const cardsLength = useMemo(() => {
        return Math.max(state.minLimit, props.cardList.length);
    }, [state.minLimit, props.cardList]);
    const computedAngle = useMemo(() => {
        return Math.PI * 2 / cardsLength;
    }, [cardsLength]);
    const matrices = useMemo(() => {
        return computeMatrices(state, props, { cardsLength, computedAngle })
    }, [state, props, cardsLength, computedAngle]);
    const cardStyles = useMemo(() => {
        let styles = [];
        for (let i = 0; i < props.cardList.length; i++) {
            styles.push({
                width: props.cardWidth,
                height: props.cardHeight,
                transform: matrices[i].toString(),
                zIndex: Math.round(matrices[i][2][3]),
            });
        }
        return styles;
    }, [state, props, matrices,]);

    //refs
    const node = React.createRef();

    //hook
    useEffect(() => {
        node.current.addEventListener("click", () => {
            setState({
                ...state,
                ...{
                    rotateAngle: state.rotateAngle + 10,
                }
            })
        });
    });


    return (
        <div ref={node} className={styles.compass}>
            <div className={styles.header}>
                {props.children.header}
            </div>
            <div className={styles.content} style={contentStyle}>
                {
                    props.cardList.map((card, index) =>
                        <div key={index} className={styles.card} style={cardStyles[index]}>
                            {props.cardContent(card, index)}
                        </div>
                    )
                }
            </div>
            <div className={styles.footer}>
                {props.children.footer}
            </div>
        </div>);
}

const computeMatrices = (state, props, args) => {
    let { rotateAngle } = state,
        { radius } = props;
    let { cardsLength, computedAngle } = args;
    let matrices = [],
        length = cardsLength,
        perAngle = computedAngle;
    rotateAngle = -rotateAngle * Math.PI / 180;
    for (var i = 0; i < length; i++) {
        var angle = perAngle * i + rotateAngle;
        var offsetX = radius * Math.sin(angle),
            offsetY = 0,
            offsetZ = radius * (Math.cos(angle) - 1);
        var matrix = new Matrix3d([1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            offsetX, offsetY, offsetZ, 1,
        ]);
        matrices.push(matrix);
    }
    return matrices;
}

Compass.defaultProps = {
    radius: 600,
    transition: 300,
    cardHeight: 220,
    cardWidth: 280,
    scrollEventInternal: 100, //  one handler for a scroll event every scrollEventInternal ms
    clickEventInterval: 200, // one handler for a click event every clickEventInterval ms,
    cardList: [
        new Card(),
        new Card(),
        new Card(),
        new Card(),
        new Card(),
        new Card(),
        new Card(),
    ],
    cardContent: (card, index) => { },
    children: {},
};

export default Compass;