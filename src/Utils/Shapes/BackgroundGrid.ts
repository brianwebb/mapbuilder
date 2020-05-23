import IShape from "./IShape";
import Grid from './../../Grid.svg';

class BackgroundGrid implements IShape {
    draw(context: CanvasRenderingContext2D): void {
        const img = document.createElement("img");
        img.onload = () => {
            context.drawImage(img, 0, 0);
            img.remove();
        };
        img.src = Grid;
    }
}

export default BackgroundGrid;
