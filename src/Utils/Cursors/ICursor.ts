import { PartialObserver } from 'rxjs';
import { CanvasAction } from '../../CanvasAction';
import { CursorOptions } from '../../Models/CursorOptions';

export interface ICursor {
    mousedown(evt: MouseEvent): void;
    mousemove(evt: MouseEvent): void;
    mouseup(evt: MouseEvent): void;
    setCursorOptions(cursorOptions: CursorOptions): void;
    subscribe(observer: PartialObserver<CanvasAction>): void;
    deactivate(): void;
};
