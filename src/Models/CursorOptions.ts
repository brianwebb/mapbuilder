import Color from 'color';

export class CursorOptions {
    public static default: CursorOptions = {
        lineColour: Color('#00000000'),
        lineWidth: 5,
        lineCap: 'round'
    };

    constructor(lineColour: Color, lineWidth: number, lineCap: CanvasLineCap) {
        this.lineColour = lineColour;
        this.lineWidth = lineWidth;
        this.lineCap = lineCap;
    }

    lineColour: Color;
    lineWidth: number;
    lineCap: CanvasLineCap;
}
