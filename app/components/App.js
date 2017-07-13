import React from 'react';
import ReactMixin from 'react-mixin';
import LinkedImmutableStateMixin from 'reactlink-immutable';

import styles from '../styles/App.css';
import BlockEditor from './blockeditor/BlockEditor';


export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            model: {
                body: []
            }
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    getValue() {
        let body = this.state.model.body;
        console.log(this.refs.body_ref.getDecoratedComponentInstance().normalizeBody(body));
    }

    render() {
        let model = this.state.model;
        return (
            <div className="App">
                <BlockEditor ref="body_ref" body={model.body} />
                <button onClick={this.getValue.bind(this)}> Get value </button>
            </div>
        )
    }
}

App.propTypes = {
    model: React.PropTypes.object
};

ReactMixin(App.prototype, LinkedImmutableStateMixin);
