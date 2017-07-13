'use strict';

import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import ElemBaseMixin from './ElemBaseMixin';
import ElemDnD from './ElemDnD';
import ElemToolbar from './ElemToolbar';

import Utils from './libs/Utils';
import _ from 'lodash';

import './styles/ElemText.css';

import deleteImage from './images/elem_del.png';
import dragBar from './images/elem_dragbar.png';

export default class ElemText extends ElemBaseMixin {

    inputNodeCreated(node) {
        this.input = node;
        if (this.input) {
            this.input.focus();
        }
    }

    onChange() {
        var elem = this.state.elem;
        elem.text = this.input.value;

        this.setState(_.assign(this.state, {
            elem
        }));
    }

    render() {
        if (this.props.renderReadOnly) {
            return this.renderReadOnly();
        }

        const isFirst = this.props.isFirst;

        const opacity = this.props.isDragging ? 0 : 1;
        const connectDragSource = this.props.connectDragSource;

        return ElemDnD.compWrapper(this,
            <div className="ElemText" style={{opacity}} onClick={this.onBodyClick.bind(this)}>

                <TextareaAutosize
                    minRows={2}
                    useCacheForDOMMeasurements
                    ref='field'
                    inputRef={this.inputNodeCreated.bind(this)}
                    value={this.state.elem.text}
                    onChange={this.onChange.bind(this)} />

                <img src={deleteImage} className="ElemDelIcon" onClick={this.onDelElem.bind(this)} />
                {connectDragSource(
                    <img src={dragBar} className="ElemDragBar" />
                )}

                <ElemToolbar
                    ref="toolbar"
                    addLink={this.onAddLink.bind(this)}
                    addText={this.onAddText.bind(this)}
                    addLocation={this.onAddLocation.bind(this)}
                    addPhoto={this.onAddPhoto.bind(this)}
                    isFirst={isFirst} />

            </div>
        );
    }

    renderReadOnly() {
        // 只读版本
        if (_.isEmpty(this.state.elem.text)) {
            return <div />;
        }

        const text = this.state.elem.text;
        const blocks = Utils.removeTags(text).split(/\n/); //.replace(/\n/g, '<br/>');
        const PTags = blocks.map((b) => {
            return <p>{b}</p>;
        });

        return (
            <div className="ElemText readonly" >
                {PTags}
            </div>
        );
    }
}



