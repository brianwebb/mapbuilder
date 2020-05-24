import * as React from 'react';
import { ICursor } from '../Utils/Cursors/ICursor';
import { CanvasObject } from '../Models/CanvasObject';
import { CursorOptions } from '../Models/CursorOptions';
import './Map.scss';
import { DummyCanvasObject } from '../Models/DummyCanvasObject';

interface IProps {
    currentCursor?: ICursor;
    cursorOptions: CursorOptions;
}

interface IState {
    height: number;
    width: number;
    map?: HTMLCanvasElement;
    tempMap?: HTMLCanvasElement;
    actions: CanvasObject[];
    tempActions: CanvasObject[];
    currentIndex: number;
};

class Map extends React.Component<IProps, IState> {
    public state: IState = {
        height: 480,
        width: 640,
        actions: [
            new DummyCanvasObject()
        ],
        tempActions: [],
        currentIndex: 1
    };

    public constructor(props: IProps) {
        super(props);
        this.keyboardEvent = this.keyboardEvent.bind(this);
    }

    public render() {
        return (
            <picture id='map'>
                <canvas id='main' width={this.state.width} height={this.state.height} >
                    <noscript>Some text here to show to non JS browsers</noscript>
                </canvas>
                <canvas id='temp' width={this.state.width} height={this.state.height}></canvas>
            </picture>
        );
    }

    public componentDidMount(): void {
        this.activateCursor();
        document.onkeypress = this.keyboardEvent;
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
        if (!this.state.map) return;

        if (prevProps.currentCursor !== this.props.currentCursor) {
            prevProps.currentCursor?.deactivate();
            this.activateCursor();
        }

        if (prevProps.cursorOptions !== this.props.cursorOptions) {
            this.props.currentCursor?.setCursorOptions(this.props.cursorOptions);
        }

        if (this.state.currentIndex >= this.state.actions.length) {
            this.setState({
                currentIndex: this.state.actions.length - 1
            });
        }

        // Draw event
        if (prevState.currentIndex < this.state.currentIndex) {
            this.drawObjects(prevState.currentIndex);
        }

        // Undo event
        if (prevState.currentIndex > this.state.currentIndex) {
            this.clearMap(this.state.map);
            this.drawObjects(0);
        }
    }

    keyboardEvent(keyboardEvent: KeyboardEvent): void {
        if (keyboardEvent.ctrlKey) {
            if (keyboardEvent.code === 'KeyZ') {
                this.undo();
            } else if (keyboardEvent.code === 'KeyY') {
                this.redo();
            }
        }
    }

    private activateCursor(): void {
        this.setState((prevState: Readonly<IState>, prevProps: Readonly<IProps>) => {
            if (prevState.map && prevProps.currentCursor) {
                prevState.map.removeEventListener('mousedown', prevProps.currentCursor.mousedown);
                prevState.map.removeEventListener('mousemove', prevProps.currentCursor.mousemove);
                prevState.map.removeEventListener('mouseup', prevProps.currentCursor.mouseup);
                document.removeEventListener('mouseup', prevProps.currentCursor.mouseup);
                document.removeEventListener('mousemove', prevProps.currentCursor.mouseup);
            }

            const map = this.findMap();
            const tempMap = this.findTempMap();
            if (this.props.currentCursor) {
                map.onmousedown = this.props.currentCursor.mousedown.bind(this.props.currentCursor);
                map.onmousemove = this.props.currentCursor.mousemove.bind(this.props.currentCursor);
                map.onmouseup = this.props.currentCursor.mouseup.bind(this.props.currentCursor);
                document.onmouseup = this.props.currentCursor.mouseup.bind(this.props.currentCursor);
                document.onmousemove = this.props.currentCursor.mousemove.bind(this.props.currentCursor);
            }

            return {
                map,
                tempMap
            }
        });
        this.props.currentCursor?.canvasObjects$.subscribe({
            next: canvasAction => {
                this.newAction(canvasAction);
            }
        });
        this.props.currentCursor?.tempCanvasObjects$.subscribe({
            next: canvasAction => {
                this.drawTemp(canvasAction);
            }
        });
    }

    private undo(): void {
        if (this.state.currentIndex === 0) return;

        this.setState({
            currentIndex: this.state.currentIndex - 1
        });
    }

    private redo(): void {
        this.setState({
            currentIndex: this.state.currentIndex + 1
        });
    }

    private newAction(canvasAction: CanvasObject): void {
        const actions = this.state.actions.slice(0, this.state.currentIndex + 1);
        this.setState({
            actions: [...actions, canvasAction],
            currentIndex: this.state.currentIndex + 1
        });
    }

    private clearMap(map?: HTMLCanvasElement): void {
        if (!map) return;

        const context = map.getContext('2d') as CanvasRenderingContext2D;

        if (map && context) {
            context.clearRect(0, 0, map.width, map.height);
        }
    }

    private drawTemp(canvasAction: CanvasObject): void {
        const context = this.state.tempMap?.getContext('2d') as CanvasRenderingContext2D;

        if (this.state.tempMap && context) {
            context.clearRect(0, 0, this.state.tempMap.width, this.state.tempMap.height);

            canvasAction.draw(context);
        }
    }

    private drawObjects(startIndex: number): void {
        this.clearMap(this.state.tempMap);
        while (startIndex <= this.state.currentIndex && startIndex < this.state.actions.length) {
            this.draw(this.state.actions[startIndex++]);
        }
    }

    private draw(canvasAction: CanvasObject): void {
        const context = this.state.map?.getContext('2d') as CanvasRenderingContext2D;

        if (context) {
            canvasAction.draw(context);
        }
    }

    private findMap: MapFinder = getMap;
    private findTempMap: MapFinder = getTempMap;
};

type MapFinder = () => HTMLCanvasElement;

const getMap: MapFinder = () => document.getElementById('main') as HTMLCanvasElement;
const getTempMap: MapFinder = () => document.getElementById('temp') as HTMLCanvasElement;

export default Map;
