import { ICursor } from './ICursor';
import { Subject, PartialObserver } from 'rxjs';
import { CanvasAction } from '../../CanvasAction';
import { Point } from '../../Models/Point';
import { CursorOptions } from '../../Models/CursorOptions';

export abstract class BaseCursor implements ICursor {
    private _mouseEvents: MouseEvent[] = [];
    private _actions: Subject<CanvasAction> = new Subject();
    protected _cursorOptions: CursorOptions = CursorOptions.default;

    mousedown(mouseEvent: MouseEvent): void {
        this._mouseEvents.push(mouseEvent);
    }

    mousemove(mouseEvent: MouseEvent): void {
        if (mouseEvent.buttons){
            this._mouseEvents.push(mouseEvent);
        }
    }

    mouseup(mouseEvent: MouseEvent): void {
        this._mouseEvents.push(mouseEvent);

        this.emitAction();
    }

    setCursorOptions(cursorOptions: CursorOptions): void {
        this._cursorOptions = cursorOptions;
    }

    subscribe(observer: PartialObserver<CanvasAction>): void {
        this._actions.subscribe(observer);
    }

    deactivate(): void {
        this._mouseEvents = [];
        this._actions.complete();
    }

    abstract draw(context: CanvasRenderingContext2D, canvasBounds: DOMRect, mouseEvents: MouseEvent[]): void;

    private emitAction(): void {
        if (!this._mouseEvents) return;

        const mouseEvents = this._mouseEvents;
        this._actions.next(context => {
            const canvasBounds = context.canvas.getBoundingClientRect();
            this.draw(context, canvasBounds, mouseEvents);
        });

        this._mouseEvents = [];
    }

    protected getCursorPosition(canvasBounds: DOMRect, mouseEvent: MouseEvent): Point {
        return {
            x: mouseEvent.clientX - canvasBounds.left,
            y: mouseEvent.clientY - canvasBounds.top
        };
    }
}
