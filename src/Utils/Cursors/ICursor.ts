import { PartialObserver } from 'rxjs';
import { CanvasObject } from '../../Models/CanvasObject';
import { CursorOptions } from '../../Models/CursorOptions';

export interface ICursor {
    mousedown(evt: MouseEvent): void;
    mousemove(evt: MouseEvent): void;
    mouseup(evt: MouseEvent): void;
    setCursorOptions(cursorOptions: CursorOptions): void;
    subscribe(observer: PartialObserver<CanvasObject>): void;
    deactivate(): void;
};
