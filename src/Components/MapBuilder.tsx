import React, { ReactNode } from 'react';
import Map from './Map';
import Options from './Options';
import { CursorOptions } from '../Models/CursorOptions';

interface IState {
    cursorOptions: CursorOptions;
}

class MapBuilder extends React.Component<{}, IState> {
    public state: IState = {
        cursorOptions: new CursorOptions()
    };

    constructor(props: {}) {
        super(props);
        this.cursorOptionsChange = this.cursorOptionsChange.bind(this);
    }

    public cursorOptionsChange(cursorOptions: CursorOptions): void {
        this.setState({
            cursorOptions
        });
    }

    public render(): ReactNode {
        return (
            <div>
                <header>
                    <h1>Map Builder</h1>
                </header>
                <Options cursorOptionsChange={this.cursorOptionsChange} />
                <Map cursorOptions={this.state.cursorOptions}/>
            </div>
        )
    }
}

export default MapBuilder;

