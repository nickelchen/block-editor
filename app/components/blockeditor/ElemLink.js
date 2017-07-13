'use strict';

import React from 'react';

import ElemBaseMixin from './ElemBaseMixin';
import ElemDnD from './ElemDnD';
import ElemToolbar from './ElemToolbar';
import ElemLinkInput from './modals/ElemLinkInput';

import Utils from './libs/Utils';

import _ from 'lodash';

import './styles/Model.css';
import './styles/ElemLinkInputModel.css';

import './styles/ElemLink.css';

import linkShowImage from './images/elem_link_show_white.png';
import linkEditImage from './images/elem_link_show_black.png';

import deleteImage from './images/elem_del.png';
import dragBar from './images/elem_dragbar.png';

export default class ElemLink extends ElemBaseMixin {
    startEditLinkValue() {
        this.onEditLink();
    }

    render() {
        if (this.props.renderReadOnly) {
            return this.renderReadOnly();
        }
        const url = this.state.elem.link.url;
        const host = Utils.getHostName(Utils.removeTags(url));

        const isFirst = this.props.isFirst;

        const opacity = this.props.isDragging ? 0 : 1;
        const connectDragSource = this.props.connectDragSource;
        return ElemDnD.compWrapper(this,
            <div className="ElemLink" style={{opacity}} onClick={this.onBodyClick.bind(this)}>
                <p onClick={this.startEditLinkValue.bind(this)}>
                    <img src={linkEditImage} className="Indicator" />
                    {host}
                </p>

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
        const url = this.state.elem.link.url;
        const host = Utils.getHostName(Utils.removeTags(url));
        return (
            <div className="ElemLink readonly" >
                <a href={url} target="_blank">
                    <div className="wrapper">
                        <img src={linkShowImage} className="Indicator" />
                        {host}
                    </div>
                </a>
            </div>
        );
    }

}


