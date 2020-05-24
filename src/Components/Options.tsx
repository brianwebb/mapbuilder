import React, { ChangeEvent } from 'react';
import { CursorOptions } from '../Models/CursorOptions';
import './Options.scss';

interface IProps {
    cursorOptionsChange: (cursorOptions: CursorOptions) => void
}

interface IState {
    cursorOptions: CursorOptions
}

class Options extends React.Component<IProps, IState> {
    public state: IState = {
        cursorOptions: CursorOptions.default
    };

    constructor(props: IProps) {
        super(props);
        this.lineColourChange = this.lineColourChange.bind(this);
    }

    lineColourChange(event: ChangeEvent<HTMLFormElement>): void {
        const target = event.target;
        const value = target.value;
        const name = target.name;

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

    public render() {
        return (
            <form id='options' onChange={this.lineColourChange}>
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
