import { BaseCursor } from './BaseCursor';
import { ICursor } from './ICursor';
import { PathBuilder } from '../../Models/CanvasObject';
import { Point } from '../../Models/Point';

export class Line extends BaseCursor implements ICursor {
    mouseup(mouseEvent: MouseEvent): void {
        super.mouseup(mouseEvent);

        this.emitAction();
    }

    buildPath(mouseEvents: MouseEvent[]): PathBuilder {
        const points: Point[] = mouseEvents
            .filter(event => event.type === 'mousedown' || event.type === 'mouseup')
            .map(event => ({
                x: event.clientX,
                y: event.clientY
            }));
        return (canvasBounds: DOMRect) => {
            const path = new Path2D();
            for (const point of points) {
                const position = this.getCursorPosition(canvasBounds, point);
                path.lineTo(position.x, position.y);
                path.moveTo(position.x, position.y);
            }
            return path;
        }
    }
}