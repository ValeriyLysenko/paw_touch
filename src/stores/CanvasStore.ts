import {
    makeObservable, observable, action, computed,
} from 'mobx';
import {
    historyDefaults, historySpecDefaults, scaleDefaults, activeToolDefaults, auxDataDefaults,
} from './CanvasStoreDefaults';

class CanvasStore {
    history: HistoryObj[][] = historyDefaults;

    historySpec: HistorySpec = historySpecDefaults;

    windowSize: number[] = [0, 0];

    mainCnavasSize: number[] = [0, 0];

    scale: ScaleToolObject = scaleDefaults;

    activeTool: ActiveTool = activeToolDefaults;

    auxData: AuxProps = auxDataDefaults;

    constructor() {
        // makeAutoObservable(this);
        makeObservable(this, {
            history: observable.shallow,
            historySpec: observable,
            windowSize: observable,
            mainCnavasSize: observable,
            scale: observable,
            activeTool: observable,
            auxData: observable,

            getScale: computed,
            getAuxData: computed,
            getActiveTool: computed,
            getMainCanvasSize: computed,
            getWindowSize: computed,
            getHistory: computed,
            getHistorySpec: computed,

            resetScale: action,
            setAuxDataCtrlKey: action,
            setScaleZoom: action,
            setActiveToolColor: action,
            setActiveToolType: action,
            setActiveToolSize: action,
            setWindowSize: action,
            setHistory: action,
            setHistoryItem: action,
            setHistorySpecPos: action,
        });
    }

    get getScale(): ScaleToolObject {
        return this.scale;
    }

    get getAuxData(): AuxProps {
        return this.auxData;
    }

    get getActiveTool(): ActiveTool {
        return this.activeTool;
    }

    get getMainCanvasSize(): number[] {
        return this.mainCnavasSize;
    }

    get getWindowSize(): number[] {
        return this.windowSize;
    }

    get getHistory(): HistoryObj[][] {
        return this.history;
    }

    get getHistorySpec(): HistorySpec {
        return this.historySpec;
    }

    resetScale(): void {
        this.scale = scaleDefaults;
    }

    setAuxDataCtrlKey(ctrlKey: boolean): void {
        this.auxData.ctrlKey = ctrlKey;
    }

    setScaleZoom(
        zoomObj: ScaleToolHistory,
        currentScale: number,
        scaledPosRatio: number[],
    ): void {
        const { scale } = this;
        this.scale = {
            ...scale,
            currentScale,
            scaleHistory: [...scale.scaleHistory, zoomObj],
            scaledPosRatio,
        };
    }

    setActiveToolColor(color: string): void {
        this.activeTool.spec.color = color;
    }

    setActiveToolType(
        type: string,
    ): void {
        this.activeTool = {
            ...this.activeTool,
            type,
        };
    }

    setActiveToolSize(size: number): void {
        this.activeTool.spec.size = size;
    }

    setWindowSize(size: number[]): void {
        this.windowSize = size;
    }

    setHistorySpecPos(pos: number): void {
        this.historySpec.position = pos;
    }

    setHistoryItem(item: HistoryObj[]): void {
        this.history.push(item);
    }

    setHistory(history: HistoryObj[][]): void {
        this.history = history;
    }

}

// class CanvasStore {
//     value

//     constructor(value) {
//         makeObservable(this, {
//             value: observable,
//             double: computed,
//             increment: action,
//             fetch: flow,
//         });
//         this.value = value;
//     }

//     get double() {
//         return this.value * 2;
//     }

//     increment() {
//         this.value++;
//     }

//     * fetch() {
//         const response = yield fetch('/api/value');
//         this.value = response.json();
//     }
// }

export default CanvasStore;
