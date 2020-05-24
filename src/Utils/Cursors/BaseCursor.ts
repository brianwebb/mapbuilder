import { ICursor } from './ICursor';
import { Subject, PartialObserver } from 'rxjs';
import { CanvasObject, PathBuilder } from '../../Models/CanvasObject';
import { CursorOptions } from '../../Models/CursorOptions';
import { Point } from '../../Models/Point';

export abstract class BaseCursor implements ICursor {
    private _actions: Subject<CanvasObject> = new Subject();
    private _mouseEvents: MouseEvent[] = [];
    protected _cursorOptions: CursorOptions = CursorOptions.default;

    abstract name: string;

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
    }

    private mouseEvent(mouseEvent: MouseEvent): void {
        this._mouseEvents.push(mouseEvent);

        if (mouseEvent.button === 2) {
            this._mouseEvents = [];
            mouseEvent.stopImmediatePropagation();
        }
    }

    setCursorOptions(cursorOptions: CursorOptions): void {
        this._cursorOptions = cursorOptions;
    }

    subscribe(observer: PartialObserver<CanvasObject>): void {
        this._actions.subscribe(observer);
    }

    deactivate(): void {
        this._mouseEvents = [];
        this._actions.complete();
    }

    abstract buildPath(mouseEvents: MouseEvent[]): PathBuilder;

    protected emitAction(): void {
        if (!this._mouseEvents) return;

        this._actions.next(new CanvasObject(this._cursorOptions, this.buildPath(this._mouseEvents)));

        this._mouseEvents = [];
    }

    protected getCursorPosition(canvasBounds: DOMRect, cursor: Point): Point {
        return {
            x: cursor.x - canvasBounds.left,
            y: cursor.y - canvasBounds.top
        };
    }
}
