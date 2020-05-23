import { PartialObserver } from 'rxjs';
import { CanvasAction } from '../../CanvasAction';

export interface ICursor {
    mousedown(evt: MouseEvent): void;
    mousemove(evt: MouseEvent): void;
    mouseup(evt: MouseEvent): void;
    subscribe(observer: PartialObserver<CanvasAction>): void;
};
