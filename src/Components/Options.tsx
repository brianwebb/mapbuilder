import React, { ChangeEvent } from 'react';
import { CursorOptions } from '../Models/CursorOptions';
import './Options.scss';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';
import { Line } from '../Utils/Cursors/Line';
import { CursorBuilder } from '../Utils/Cursors/CursorBuilder';

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

    private cursorOptions: CursorBuilder[] = [
        {
            name: 'Pencil',
            build: () => new Pencil()
        },
        {
            name: 'Line',
            build: () => new Line()
        }
    ];

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
        const cursorBuilder = this.cursorOptions.find(builder => builder.name === value);
        if (!cursorBuilder) {
            throw new Error(`Could not find builder with name ${value}`);
        }
        this.setState(
            {
                cursor: cursorBuilder.build()
            },
            () => {
                this.props.cursorChange(this.state.cursor);
            }
        );
    }

    public render() {
        const cursorOptions = this.cursorOptions.map(builder =>
        <label>
            {builder.name}
            <input type='radio' name='cursor' value={builder.name} defaultChecked={this.state.cursor.name  === builder.name} />
        </label>)
        return (
            <form id='options' onChange={this.valueChange}>
                {cursorOptions}
                <label>
                    Colour
                    <input type='color' name='lineColour' defaultValue={this.state.cursorOptions.lineColour} />
                </label>
                <label>
                    Width
                    <select name='lineWidth' defaultValue={this.state.cursorOptions.lineWidth}>
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
