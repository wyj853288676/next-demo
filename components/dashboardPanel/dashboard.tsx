import { useMemo, useState } from "react";
import styles from "./dashboard.module.scss";
import DashboardPanel from "./DashboardPanelWidget";
import Compass from "@/components/compass/compass";
import * as _ from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Button } from "antd";

const ERROR_CODES = {
    NOT_ENOUGH: "Panels not enough.",
    NOT_FOUND: "Panel not found.",
    POP_OUT_FAILED: "Can not pop out a new window. Please check the site settings of your browser",
}

const Dashboard = (props: any) => {
    let [state, setState] = useState({
        //how many rows
        dimensionRow: 4,
        //how many columns
        dimensionCol: 5,
        //width of each panel
        unitWidth: 200,
        //height of each panel
        unitHeight: 220,
        //max width of  each panel
        maxWidth: 350,
        //max height of  each panel
        maxHeight: 350,
        //show compass or not
        addingPanel: false,
        //close animation
        closeAnimation: false,
        dragListeners: {},
        domMounted: false,
        /**
         *   {panel.key: panel ...} 
         *   If you set some properties of a panel directly(such as sizeOffsetX/Y, dragging,resizing ..) , it will trigger
         *   the update of computed attribute <matrixPanels>, which is unnecessary
         *   so considering the performance, you can update the style-related properties here and access them in the computedStyles.
         * */
        extendPanelProperties: {},
        popoutWindows: [],
        oldPanelsJSON: null,
    });

    //memoized values
    const matrixPanels = useMemo(() => {
        return computeMatrixPanels(state, props);
    }, [state]);


    const computedDashboardStyle = useMemo(() => {
        const columns = 100 / state.dimensionCol + "%",
            rows = 100 / state.dimensionRow + "%";
        return {
            gridTemplateColumns: `repeat(auto-fill, ${columns})`,
            gridTemplateRows: `repeat(auto-fill, ${rows})`,
        };
    }, [state]);

    const showCompassModal = () => {
        setState({
            ...state,
            ...{
                addingPanel: true,
            }
        });
    };

    const cardContent = (card, index) => <span style={{ color: "red" }}>{index}</span>

    return (
        <div className={styles.dashboard} style={computedDashboardStyle}>
            {
                matrixPanels.matrix.map(panels =>
                    panels.map(v =>
                        <div key={v.key} className={styles["dashboard-panel"]} status="0">
                            <div onClick={showCompassModal} className={styles["dashboard-panel-content"]}>
                                <PlusOutlined />
                            </div>
                        </div>
                    )
                )
            }
            <Modal width={"min(1300px, 100% - 10px)"} title="Choose One Widget" visible={state.addingPanel} footer={null}>
                <Compass cardContent={cardContent}>
                    
                </Compass>
            </Modal>
        </div >

    );
}

Dashboard.defaultProps = {
    panels: [],
}

const getPanelKey = (x: number, y: number) => {
    return x + "-" + y;
}


const computeMatrixPanels = (state, props) => {
    let { dimensionCol, dimensionRow, domMounted } = state;
    let { panels } = props;
    let arr = [], computedPanels = [];
    //init arr
    for (let i = 0; i < dimensionRow; i++) {
        arr[i] = new Array(dimensionCol);
        for (let j = 0; j < dimensionCol; j++) {
            arr[i][j] = {
                x: i,
                y: j,
                key: getPanelKey(i, j),
                lengthCol: 1,
                lengthRow: 1,
                //  0 available  1 root panel 2 occupied but not root;
                status: 0,
                parentPanel: null,
            };
        }
    }
    let popoutFailed = false;
    //if the domMounted is false, it means the dimensionX/dimensionY will change, considering the performance , the panels will not be added into the computedPanels;
    for (let i = 0; i < panels.length && domMounted; i++) {
        //ignore  panels that are poppingout
        if (!(panels[i] instanceof DashboardPanel)) {
            //popout this panels
            continue;
        }
        if (panels[i].poppingout) {
            let alreadyPopout = true;
            try {
                popoutPanel(panels[i]);
            } catch (e) {
                console.error(e);
                popoutFailed = true;
                alreadyPopout = false;
            }
            if (alreadyPopout) {
                continue;
            }
        }
        let panel = panels[i];
        //update dimension of the DashboardPanel instance
        //Don't set panel.dimension = {} directly, it will trigger the change event even though the dimensionCol/dimensionRow didn't change
        panel.dimension.dimensionCol = dimensionCol;
        panel.dimension.dimensionRow = dimensionRow;

        //update the index
        panel.index = i;
        //try resize the panel. if failed, ignore the panel
        let availablePanelSet = findPanelAvailable(Object.assign({}, panel, {
            panelKey: panel.key,
            matrix: arr,
            strictXY: true,
        }));
        //panel can not be set into dashboard
        if (!availablePanelSet) {
            continue;
        }
        if (panel.lengthCol != availablePanelSet.col || panel.lengthRow != availablePanelSet.row) {
            notifyPanelResize(panel, {
                newSize: _.pick(availablePanelSet, ["col", "row"]),
                oldSize: {
                    col: panel.lengthCol,
                    row: panel.lengthRow,
                },
            });
        }
        panel.lengthCol = availablePanelSet.col;
        panel.lengthRow = availablePanelSet.row;
        panel.x = availablePanelSet.x;
        panel.y = availablePanelSet.y;

        //set status
        for (let x = 0; x < panel.lengthRow; x++) {
            for (let y = 0; y < panel.lengthCol; y++) {
                Object.assign(arr[x + panel.x][y + panel.y], {
                    status: (x == 0 && y == 0) ? 1 : 2,
                    parentPanel: panel.key,
                });
            }
        }
        computedPanels[getPanelKey(panel.x, panel.y)] = panel;
    }
    if (popoutFailed) {
        $message({
            type: "error",
            message: ERROR_CODES.POP_OUT_FAILED,
        });
    }
    return { matrix: arr, computedPanels };
}

const $message = (str: any) => {
    console.log(str);
}

const findPanelAvailable = () => {
    return null;
}

const popoutPanel = () => {
    console.log("pop out");
}
const notifyPanelResize = (panel, { newSize, oldSize }) => {
    console.log("panel resize", panel, { newSize, oldSize });
}




export default Dashboard;