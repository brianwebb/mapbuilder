import * as React from 'react';
import {Subject, NextObserver} from 'rxjs';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';
import { CanvasObject } from '../Models/CanvasObject';
import { CursorOptions } from '../Models/CursorOptions';
import './Map.scss';

interface IProps {
    currentCursor?: ICursor;
    cursorOptions: CursorOptions;
}

interface IState {
    height: number;
    historyIndex: number;
    width: number;
    map?: HTMLCanvasElement;
    actions: Subject<CanvasObject>;
};

class Map extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        currentCursor: new Pencil()
    };

    public state: IState = {
        height: 480,
        historyIndex: 0,
        width: 640,
        actions: new Subject()
    };

    public render() {
        return (
            <picture>
                <canvas id='map' width={this.state.width} height={this.state.height}>
                    <noscript>Some text here to show to non JS browsers</noscript>
                </canvas>
            </picture>
        );
    }

    public componentDidMount(): void {
        const canvas = document.getElementById('map') as HTMLCanvasElement;
        this.setState(
            {
                map: canvas
            },
            () => {
                this.state.actions.subscribe({
                    next: actionState => {
                        this.enactHistory(this.state.map, actionState)
                    }
                });
                this.activateCursor(this.state.map, this.props.currentCursor, {
                    next: canvasAction => this.state.actions.next(canvasAction)
                });
            }
        );
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
        if (!this.state.map) return;

        if (prevProps.currentCursor !== this.props.currentCursor) {
            prevProps.currentCursor?.deactivate();
            this.activateCursor(this.state.map, this.props.currentCursor, {
                next: canvasAction => this.state.actions.next(canvasAction)
            });
        }

        if (prevProps.cursorOptions !== this.props.cursorOptions) {
            this.props.currentCursor?.setCursorOptions(this.props.cursorOptions);
        }
    }

    public enactHistory: CanvasObjectRenderer = historyEnactor;
    public activateCursor: CursorActivator = cursorActivator;
};

type CanvasObjectRenderer = (canvas: HTMLCanvasElement | undefined, object: CanvasObject) => void;
type CursorActivator = (canvas: HTMLCanvasElement | undefined, cursor: ICursor | undefined, observer: NextObserver<CanvasObject>) => void;

const historyEnactor: CanvasObjectRenderer = (canvas, object) => {
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D;

    if (context) {
        object.draw(context);
    }
};

const cursorActivator: CursorActivator = (canvas, cursor, observer) => {
    if (!canvas || !cursor) return;

    canvas.onmousedown = evt => cursor.mousedown(evt);
    canvas.onmousemove = evt => cursor.mousemove(evt);
    canvas.onmouseup = evt => cursor.mouseup(evt);
    cursor.subscribe(observer);
};

export default Map;
