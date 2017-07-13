'use strict';

import React from 'react';
import {Modal, Button} from 'react-bootstrap';

import _ from 'lodash';
import '../styles/ElemLinkInput.css';

import cross from '../images/white_cross.png';
import check from '../images/white_check.png';

export default class ElemLinkInput extends React.Component {

    constructor() {
        super();
        this.state = {
            link: {
                url: ''
            }
        };
    }

    onChange() {
        const newLink = {
            url: encodeURI(this.linkInput.value)
        };
        this.props.onChange('linkInputModal', {
            link: newLink
        });
    }

    normalizeLink(link) {
        link.url = link.url || '';
        return link;
    }

    componentDidMount() {
        const link = this.normalizeLink(_.cloneDeep(this.props.link));
        this.setState(_.assign(this.state, {
            link: link
        }));
    }

    componentWillReceiveProps(nextProps, nextState) {
        const link = this.normalizeLink(_.cloneDeep(nextProps.link));
        this.setState(_.assign(this.state, {
            link: link
        }));
    }

    confirmThisModal() {
        const link = this.state.link;
        this.props.onConfirm(link);
    }

    cancelThisModal() {
        this.props.onCancel('linkInputModal');
    }

    render() {
        return (
            <div>
                <Modal
                    show={this.props.isOpen}
                    animation={false}
                    dialogClassName='ElemLinkInput'
                    >
                    <Modal.Header>
                        <Modal.Title>网页链接</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input ref={(input) => { this.linkInput = input }}
                            placeholder="请输入网页链接"
                            value={this.state.link.url}
                            onChange={this.onChange.bind(this)} />
                    </Modal.Body>

                    <Modal.Footer>
                        <span className="cancel" onClick={this.cancelThisModal.bind(this)}>
                            <img src={cross} className="DialogIcon" />
                        </span>
                        <span className="confirm" onClick={this.confirmThisModal.bind(this)}>
                            <img src={check} className="DialogIcon" />
                        </span>
                    </Modal.Footer>
                </Modal>
            </div>
          );
    }
}

ElemLinkInput.propTypes = {
    link: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool.isRequired
};

