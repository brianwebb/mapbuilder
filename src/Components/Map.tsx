import * as React from 'react';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pointer } from '../Utils/Cursors/Pointer';
import CanvasAction from '../CanvasAction';
import BackgroundGrid from '../Utils/Shapes/BackgroundGrid';


interface IProps {
    currentCursor?: ICursor;
}

interface IState {
    height: number;
    width: number;
    map?: HTMLCanvasElement;
    actions: CanvasAction[];
};

class Map extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        currentCursor: new Pointer()
    };

    public state: IState = {
        height: 480,
        width: 640,
        actions: [
            new BackgroundGrid().draw
        ]
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
        this.state.map = document.getElementById('map') as HTMLCanvasElement;
        this.enactHistory(this.state.map, this.state.actions);
    }

    public enactHistory: CanvasActionEnactor = historyEnactor;
};

type CanvasActionEnactor = (canvas: HTMLCanvasElement, actions: CanvasAction[]) => void;

const historyEnactor: CanvasActionEnactor = (canvas, actions) => {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (context) {
        for (const canvasAction of actions) {
            canvasAction(context);
        }
    }
};

export default Map;
