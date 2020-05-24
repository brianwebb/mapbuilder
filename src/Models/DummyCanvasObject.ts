import { CanvasObject } from "./CanvasObject";
import { CursorOptions } from "./CursorOptions";

export class DummyCanvasObject extends CanvasObject {
    constructor() {
        super(CursorOptions.default, (canvasBounds) => new Path2D(), false);
    }

    draw(context: CanvasRenderingContext2D): void {
        // no op
    }
}