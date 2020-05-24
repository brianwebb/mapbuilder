export class CursorOptions {
    public static default: CursorOptions = {
        lineColour: 'black',
        lineWidth: 5,
        lineCap: 'round'
    };

    constructor(lineColour: string, lineWidth: number, lineCap: CanvasLineCap) {
        this.lineColour = lineColour;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
    }

    lineColour: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
}
