'use strict';

import React from 'react';

import ElemBaseMixin from './ElemBaseMixin';
import ElemDnD from './ElemDnD';
import ElemToolbar from './ElemToolbar';

import _ from 'lodash';

import './styles/Model.css';
import './styles/ElemLinkInputModel.css';

import './styles/ElemLocation.css';

import locationShowImage from './images/elem_location_show_white.png';
import locationEditImage from './images/elem_location_show_black.png';

import deleteImage from './images/elem_del.png';
import dragBar from './images/elem_dragbar.png';

export default class ElemLocation extends ElemBaseMixin {

    startEditLocationValue() {
        this.onEditLocation();
    }

    render() {
        if (this.props.renderReadOnly) {
            return this.renderReadOnly();
        }

        const isFirst = this.props.isFirst;

        const opacity = this.props.isDragging ? 0 : 1;
        const location = this.state.elem.place ? this.state.elem.place.name : '';
        const connectDragSource = this.props.connectDragSource;
        return ElemDnD.compWrapper(this,
            <div className="ElemLocation" style={{opacity}} onClick={this.onBodyClick.bind(this)}>
                <p onClick={this.startEditLocationValue.bind(this)}>
                    <img src={locationEditImage} className="Indicator" />
                    {location}
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
        const location = this.state.elem.place ? this.state.elem.place.name : '';
        return (
            <div className="ElemLocation readonly" >
                <div className="wrapper">
                    <img src={locationShowImage} className="Indicator" />
                    {location}
                </div>
            </div>
        );
    }
}



