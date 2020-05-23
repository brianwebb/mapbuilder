import * as React from 'react';
import {Subject} from 'rxjs';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';
import CanvasAction from '../CanvasAction';
import BackgroundGrid from '../Utils/Shapes/BackgroundGrid';


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
        canvas.onmousedown = evt => this.props.currentCursor?.mousedown(evt);
        canvas.onmousemove = evt => this.props.currentCursor?.mousemove(evt);
        canvas.onmouseup = evt => this.props.currentCursor?.mouseup(evt);
        this.props.currentCursor?.subscribe({
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
};

type CanvasActionEnactor = (canvas: HTMLCanvasElement | undefined, actions: CanvasAction) => void;

const historyEnactor: CanvasActionEnactor = (canvas, action) => {
    const context = canvas?.getContext('2d') as CanvasRenderingContext2D;

    if (context) {
        action(context);
    }
};

export default Map;
