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
            lineCap: name === 'lineCap' ? value : this.state.cursorOptions.lineCap,
            lineColour: name === 'lineColour' ? value : this.state.cursorOptions.lineColour,
            lineWidth: name === 'lineWidth' ? value : this.state.cursorOptions.lineWidth
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
                    <input type='number' name='lineWidth' value={this.state.cursorOptions.lineWidth} />
                </label>
                <label>
                    Cap
                    <input type='text' name='lineCap' value={this.state.cursorOptions.lineCap} />
                </label>
            </form>
        );
    }
}

export default Options;
