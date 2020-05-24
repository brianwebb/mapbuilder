import { ICursor } from './ICursor';

export type CursorBuilder = {
    name: string;
    build: () => ICursor;
};
