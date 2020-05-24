import React, { ReactNode } from 'react';
import Map from './Map';
import Options from './Options';
import { CursorOptions } from '../Models/CursorOptions';
import { ICursor } from '../Utils/Cursors/ICursor';
import { Pencil } from '../Utils/Cursors/Pencil';

interface IState {
    cursorOptions: CursorOptions;
    cursor: ICursor
}

class MapBuilder extends React.Component<{}, IState> {
    public state: IState = {
        cursorOptions: CursorOptions.default,
        cursor: new Pencil()
    };

    constructor(props: {}) {
        super(props);
        this.cursorOptionsChange = this.cursorOptionsChange.bind(this);
        this.cursorChange = this.cursorChange.bind(this);
    }

    public cursorOptionsChange(cursorOptions: CursorOptions): void {
        this.setState({
            cursorOptions
        });
    }

    public cursorChange(cursor: ICursor): void {
        this.setState({
            cursor
        })
    }

    public render(): ReactNode {
        return (
            <div>
                <header>
                    <h1>Map Builder</h1>
                </header>
                <Options cursorOptionsChange={this.cursorOptionsChange} cursorChange={this.cursorChange} />
                <Map cursorOptions={this.state.cursorOptions} currentCursor={this.state.cursor} />
            </div>
        )
    }
}

export default MapBuilder;

