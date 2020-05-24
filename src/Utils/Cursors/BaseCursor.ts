import { ICursor } from './ICursor';
import { Subject, PartialObserver } from 'rxjs';
import { CanvasObject, PathBuilder } from '../../Models/CanvasObject';
import { CursorOptions } from '../../Models/CursorOptions';
import { Point } from '../../Models/Point';

export abstract class BaseCursor implements ICursor {
    private _mouseEvents: MouseEvent[] = [];
    private _actions: Subject<CanvasObject> = new Subject();
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

    subscribe(observer: PartialObserver<CanvasObject>): void {
        this._actions.subscribe(observer);
    }

    deactivate(): void {
        this._mouseEvents = [];
        this._actions.complete();
    }

    abstract buildPath(mouseEvents: MouseEvent[]): PathBuilder;

    private emitAction(): void {
        if (!this._mouseEvents) return;

        this._actions.next(new CanvasObject(this._cursorOptions, this.buildPath(this._mouseEvents)));

        this._mouseEvents = [];
    }

    protected getCursorPosition(canvasBounds: DOMRect, mouseEvent: MouseEvent): Point {
        return {
            x: mouseEvent.clientX - canvasBounds.left,
            y: mouseEvent.clientY - canvasBounds.top
        };
    }
}
