import { BaseCursor } from './BaseCursor';
import { ICursor } from './ICursor';
import { PathBuilder } from '../../Models/CanvasObject';
import { Point } from '../../Models/Point';

interface LinePoint extends Point {
    shiftPushed: boolean;
}

export class Line extends BaseCursor implements ICursor {
    name: string = 'Line';

    mouseup(mouseEvent: MouseEvent): void {
        super.mouseup(mouseEvent);

        this.emitObject();
    }

    buildPath(mouseEvents: MouseEvent[]): PathBuilder {
        const start: LinePoint = {
            shiftPushed: mouseEvents[0].shiftKey,
            x: mouseEvents[0].clientX,
            y: mouseEvents[0].clientY
        };
        const end: LinePoint = {
            shiftPushed: mouseEvents[mouseEvents.length - 1].shiftKey,
            x: mouseEvents[mouseEvents.length - 1].clientX,
            y: mouseEvents[mouseEvents.length - 1].clientY
        };
        return (canvasBounds: DOMRect) => {
            const path = new Path2D();
            const startPosition = this.getCursorPosition(canvasBounds, start);
            path.moveTo(startPosition.x, startPosition.y);
            const endPosition = this.getCursorPosition(canvasBounds, end);
            if (end.shiftPushed) {
                const xDiff = Math.abs(endPosition.x - startPosition.x);
                const yDiff = Math.abs(endPosition.y - startPosition.y);
                if (xDiff >= yDiff) {
                    endPosition.y = startPosition.y;
                } else {
                    endPosition.x = startPosition.x;
                }
            }
            path.lineTo(endPosition.x, endPosition.y);
            return path;
        }
    }
}