import React, { ChangeEvent } from 'react';
import { CursorOptions } from '../Models/CursorOptions';
import './Options.scss';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';
import { Line } from '../Utils/Cursors/Line';

interface IProps {
    cursorOptionsChange: (cursorOptions: CursorOptions) => void,
    cursorChange: (cursor: ICursor) => void
}

interface IState {
    cursorOptions: CursorOptions,
    cursor: ICursor
}

class Options extends React.Component<IProps, IState> {
    public state: IState = {
        cursorOptions: CursorOptions.default,
        cursor: new Pencil()
    };

    constructor(props: IProps) {
        super(props);
        this.valueChange = this.valueChange.bind(this);
    }

    valueChange(event: ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === 'cursor') {
            this.setCursor(value);
        }

        const updatedOptions: CursorOptions = {
            lineColour: name === 'lineColour' ? value : this.state.cursorOptions.lineColour,
            lineWidth: name === 'lineWidth' ? value : this.state.cursorOptions.lineWidth,
            lineCap: this.state.cursorOptions.lineCap
        };
        this.setState(
            {
                cursorOptions: updatedOptions
            },
            () => {
                this.props.cursorOptionsChange(this.state.cursorOptions);
            }
        );
    }

    private setCursor(value: string): void {
        let newCursor: ICursor;
        switch (value) {
            case 'Pencil':
                newCursor = new Pencil();
                break;
            case 'Line':
                newCursor = new Line();
                break;
            default:
                throw new Error('Cursor not mapped');
        }
        this.setState(
            {
                cursor: newCursor
            },
            () => {
                this.props.cursorChange(this.state.cursor);
            }
        );
    }

    public render() {
        return (
            <form id='options' onChange={this.valueChange}>
                <label>
                    Pencil
                    <input type='radio' name='cursor' value='Pencil' />
                </label>
                <label>
                    Line
                    <input type='radio' name='cursor' value='Line' />
                </label>
                <label>
                    Colour
                    <input type='color' name='lineColour' value={this.state.cursorOptions.lineColour} />
                </label>
                <label>
                    Width
                    <select name='lineWidth' value={this.state.cursorOptions.lineWidth}>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='5'>5</option>
                        <option value='8'>8</option>
                        <option value='13'>13</option>
                        <option value='21'>21</option>
                    </select>
                </label>
            </form>
        );
    }
}

export default Options;
