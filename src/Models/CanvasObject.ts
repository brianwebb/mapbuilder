import { CursorOptions } from './CursorOptions';
import { Guid } from '../Utils/Guid';

export class CanvasObject {
    private _cursorOptions: CursorOptions;
    private _path: PathBuilder;
    id: string;

    constructor(cursorOptions: CursorOptions, path: PathBuilder) {
        this._cursorOptions = {...cursorOptions};
        this._path = path;
        this.id = Guid.newGuid();
    }

    draw(context: CanvasRenderingContext2D): void {
        context.strokeStyle = this._cursorOptions.lineColour;
        context.lineWidth = this._cursorOptions.lineWidth;
        context.lineCap = this._cursorOptions.lineCap;
        const location = context.canvas.getBoundingClientRect();
        context.stroke(this._path(location));
    }
}

export type PathBuilder = (canvasBounds: DOMRect) => Path2D;
