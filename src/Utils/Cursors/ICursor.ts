import { Subject } from 'rxjs';
import { CanvasObject } from '../../Models/CanvasObject';
import { CursorOptions } from '../../Models/CursorOptions';

export interface ICursor {
    name: string;
    canvasObjects$: Subject<CanvasObject>;
    mousedown(evt: MouseEvent): void;
    mousemove(evt: MouseEvent): void;
    mouseup(evt: MouseEvent): void;
    setCursorOptions(cursorOptions: CursorOptions): void;
    deactivate(): void;
};
