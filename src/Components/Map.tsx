import * as React from 'react';
import {Subject, PartialObserver, NextObserver} from 'rxjs';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';
import { CanvasAction } from '../CanvasAction';
import { BackgroundGrid } from '../Utils/Shapes/BackgroundGrid';


interface IProps {
    currentCursor?: ICursor;
}

interface IState {
    height: number;
    historyIndex: number;
    width: number;
    map?: HTMLCanvasElement;
    actions: Subject<CanvasAction>;
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
        this.activateCursor(canvas, this.props.currentCursor, {
            next: canvasAction => this.state.actions.next(canvasAction)
        });
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
                this.state.actions.next(new BackgroundGrid().draw);
            }
        );
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>): void {
        if (!this.state.map) return;
    }

    public enactHistory: CanvasActionEnactor = historyEnactor;
    public activateCursor: CursorActivator = cursorActivator;
};

type CanvasActionEnactor = (canvas: HTMLCanvasElement | undefined, actions: CanvasAction) => void;
type CursorActivator = (canvas: HTMLCanvasElement | undefined, cursor: ICursor | undefined, observer: NextObserver<CanvasAction>) => void;

const historyEnactor: CanvasActionEnactor = (canvas, action) => {
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D;

    if (context) {
        action(context);
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
