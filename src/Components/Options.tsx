import React, { ChangeEvent } from 'react';
import { CursorOptions } from '../Models/CursorOptions';

interface IProps {
    cursorOptionsChange: (cursorOptions: CursorOptions) => void
}

interface IState {
    cursorOptions: CursorOptions
}

class Options extends React.Component<IProps, IState> {
    public state: IState = {
        cursorOptions: {
            lineColour: 'black'
        }
    };

    constructor(props: IProps) {
        super(props);
        this.lineColourChange = this.lineColourChange.bind(this);
    }

    lineColourChange(evt: ChangeEvent<HTMLInputElement>): void {
        this.setState(
            {
                cursorOptions: {
                    ...this.state.cursorOptions,
                    lineColour: evt.target.value
                }
            },
            () => {
                this.props.cursorOptionsChange(this.state.cursorOptions);
            }
        );
    }

    public render() {
        return (
            <ul className='options'>
                <li>
                    <label>
                        Colour:
                        <input type='color' value={this.state.cursorOptions.lineColour} onChange={this.lineColourChange} />
                    </label>
                </li>
            </ul>
        );
    }
}

export default Options;
