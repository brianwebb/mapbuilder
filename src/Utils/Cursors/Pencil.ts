import { ICursor } from './ICursor';
import { BaseCursor } from './BaseCursor';

export class Pencil extends BaseCursor implements ICursor {
    draw(context: CanvasRenderingContext2D, canvasBounds: DOMRect, mouseEvents: MouseEvent[]): void {
        context.strokeStyle = this._cursorOptions.lineColour;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.beginPath();
        for (const mouseEvent of mouseEvents) {
            const position = this.getCursorPosition(canvasBounds, mouseEvent);
            context.lineTo(position.x, position.y);
            context.moveTo(position.x, position.y);
        }
        context.stroke();
    }
}
