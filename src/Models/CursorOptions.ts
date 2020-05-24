import Color from 'color';

export class CursorOptions {
    public static default: CursorOptions = {
        lineColour: Color.rgb('black'),
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
