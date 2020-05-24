import { BaseCursor } from './BaseCursor';
import { ICursor } from './ICursor';
import { PathBuilder } from '../../Models/CanvasObject';
import { Point } from '../../Models/Point';

export class Line extends BaseCursor implements ICursor {
    name: string = typeof(Line).name;

    mouseup(mouseEvent: MouseEvent): void {
        super.mouseup(mouseEvent);

        this.emitObject();
    }

    buildPath(mouseEvents: MouseEvent[]): PathBuilder {
        const points: Point[] = [mouseEvents[0], mouseEvents[mouseEvents.length - 1]]
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