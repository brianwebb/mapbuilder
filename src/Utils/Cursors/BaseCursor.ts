import { ICursor } from './ICursor';
import { Subject } from 'rxjs';
import { CanvasObject, PathBuilder } from '../../Models/CanvasObject';
import { CursorOptions } from '../../Models/CursorOptions';
import { Point } from '../../Models/Point';

export abstract class BaseCursor implements ICursor {
    private _mouseEvents: MouseEvent[] = [];
    protected _cursorOptions: CursorOptions = CursorOptions.default;

    public canvasObjects$: Subject<CanvasObject> = new Subject();
    public tempCanvasObjects$: Subject<CanvasObject> = new Subject();

    abstract name: string;

    mousedown(mouseEvent: MouseEvent): void {
        this._mouseEvents.push(mouseEvent);

        mouseEvent.stopImmediatePropagation();
    }

    mousemove(mouseEvent: MouseEvent): void {
        if (mouseEvent.buttons){
            this._mouseEvents.push(mouseEvent);

            this.emitTempObject();

            mouseEvent.stopImmediatePropagation();
        }
    }

    mouseup(mouseEvent: MouseEvent): void {
        this._mouseEvents.push(mouseEvent);

        mouseEvent.stopImmediatePropagation();
    }

    setCursorOptions(cursorOptions: CursorOptions): void {
        this._cursorOptions = cursorOptions;
    }

    deactivate(): void {
        this._mouseEvents = [];
        this.canvasObjects$.complete();
    }

    abstract buildPath(mouseEvents: MouseEvent[]): PathBuilder;

    protected emitTempObject(): void {
        if (!this._mouseEvents) return;

        this.tempCanvasObjects$.next(new CanvasObject(this._cursorOptions, this.buildPath(this._mouseEvents), true));
    }

    protected emitObject(): void {
        if (!this._mouseEvents) return;

        this.canvasObjects$.next(new CanvasObject(this._cursorOptions, this.buildPath(this._mouseEvents), false));

        this._mouseEvents = [];
    }

    protected getCursorPosition(canvasBounds: DOMRect, cursor: Point): Point {
        return {
            x: cursor.x - canvasBounds.left,
            y: cursor.y - canvasBounds.top
        };
    }
}
