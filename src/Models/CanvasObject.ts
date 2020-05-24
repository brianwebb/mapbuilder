import { CursorOptions } from './CursorOptions';

export class CanvasObject {
    _cursorOptions: CursorOptions;
    _path: PathBuilder;

    constructor(cursorOptions: CursorOptions, path: PathBuilder) {
        this._cursorOptions = {...cursorOptions};
        this._path = path;
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
