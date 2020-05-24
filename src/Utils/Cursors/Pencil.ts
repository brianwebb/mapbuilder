import { ICursor } from './ICursor';
import { BaseCursor } from './BaseCursor';
import { PathBuilder } from '../../Models/CanvasObject';

export class Pencil extends BaseCursor implements ICursor {
    buildPath(mouseEvents: MouseEvent[]): PathBuilder {
        return (canvasBounds: DOMRect) => {
            const path = new Path2D();
            for (const mouseEvent of mouseEvents) {
                const position = this.getCursorPosition(canvasBounds, mouseEvent);
                path.lineTo(position.x, position.y);
                path.moveTo(position.x, position.y);
            }
            return path;
        }
    }
}
