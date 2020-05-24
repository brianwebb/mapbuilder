import { CursorOptions } from './CursorOptions';
import { Guid } from '../Utils/Guid';

export class CanvasObject {
    private _cursorOptions: CursorOptions;
    private _path: PathBuilder;
    id: string;

    constructor(cursorOptions: CursorOptions, path: PathBuilder, tempObject: boolean) {
        this._cursorOptions = {...cursorOptions};
        this._path = path;
        this.id = Guid.newGuid();
        if (tempObject) {
            this._cursorOptions.lineColour = this._cursorOptions.lineColour.negate();
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        context.strokeStyle = this._cursorOptions.lineColour.hex();
        context.lineWidth = this._cursorOptions.lineWidth;
        context.lineCap = this._cursorOptions.lineCap;
        const location = context.canvas.getBoundingClientRect();
        context.stroke(this._path(location));
    }
}

export type PathBuilder = (canvasBounds: DOMRect) => Path2D;
