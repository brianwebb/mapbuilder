import * as React from 'react';
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
    width: number;
    map?: HTMLCanvasElement;
    actions: CanvasObject[];
    currentIndex: number;
};

class Map extends React.Component<IProps, IState> {
    public static defaultProps: Partial<IProps> = {
        currentCursor: new Pencil()
    };

    public state: IState = {
        height: 480,
        width: 640,
        actions: [],
        currentIndex: 0
    };

    public constructor(props: IProps) {
        super(props);
        this.keyboardEvent = this.keyboardEvent.bind(this);
    }

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

        if (prevState.currentIndex !== this.state.currentIndex) {
            if (prevState.currentIndex > this.state.currentIndex) {
                this.clearCanvas();
            }
            let currentIndex = 0;
            while (currentIndex <= this.state.currentIndex && currentIndex < this.state.actions.length) {
                this.draw(this.state.actions[currentIndex++]);
            }
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
        this.setState((prevState: Readonly<IState>, prevProps: Readonly<IProps>): Pick<IState, "map"> => {
            if (prevState.map && prevProps.currentCursor) {
                prevState.map.removeEventListener('mousedown', prevProps.currentCursor.mousedown);
                prevState.map.removeEventListener('mousemove', prevProps.currentCursor.mousemove);
                prevState.map.removeEventListener('mouseup', prevProps.currentCursor.mouseup);
            }

            const newMap = this.findMap();
            if (this.props.currentCursor) {
                newMap.onmousedown = this.props.currentCursor.mousedown.bind(this.props.currentCursor);
                newMap.onmousemove = this.props.currentCursor.mousemove.bind(this.props.currentCursor);
                newMap.onmouseup = this.props.currentCursor.mouseup.bind(this.props.currentCursor);
            }

            return {
                map: newMap
            }
        });
        this.props.currentCursor?.subscribe({
            next: canvasAction => {
                this.newAction(canvasAction);
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

    private clearCanvas(): void {
        const context = this.state.map?.getContext('2d') as CanvasRenderingContext2D;

        if (this.state.map && context) {
            context.clearRect(0, 0, this.state.map.width, this.state.map.height);
        }
    }

    private draw(canvasAction: CanvasObject): void {
        const context = this.state.map?.getContext('2d') as CanvasRenderingContext2D;

        if (context) {
            canvasAction.draw(context);
        }
    }

    private findMap: MapFinder = getMap;
};

type MapFinder = () => HTMLCanvasElement;

const getMap: MapFinder = () => document.getElementById('map') as HTMLCanvasElement;

export default Map;
