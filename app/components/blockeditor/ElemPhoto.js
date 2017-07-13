'use strict';

import React from 'react';
import Dropzone from 'react-dropzone';

import ImageData from './libs/ImageData';

import ElemBaseMixin from './ElemBaseMixin';
import ElemDnD from './ElemDnD';
import ElemToolbar from './ElemToolbar';

import './styles/ElemPhoto.css';

import changePhoto from './images/elem_change_photo.png';

import deleteImage from './images/elem_del.png';
import retryImage from './images/retry.png';
import dragBar from './images/elem_dragbar.png';
import NumConstants from './constants/NumConstants';

import _ from 'lodash';

// 图片元素的状态。
// file         选择图片
// resized      已经加载
// ready        上传成功
// oversize     尺寸过大

export default class ElemPhoto extends ElemBaseMixin {

    updateElemState(newAttrs) {
        let elem = this.state.elem;
        elem = _.assign(elem, newAttrs);

        this.setState(_.assign(this.state, {
            elem
        }));
    }

    getChange() {
        return {
            photo: this.state.elem.photo,
            photo_status: this.state.elem.photo_status
        };
    }

    startUpload(photoData) {
        if (photoData.length > NumConstants.MAX_LIMIT.image_size) {
            this.updateElemState({
                photo_status: 'oversize'
            });
            return;
        }
        // fake uploading...
        setTimeout(() => {
            this.updateElemState({
                photo_status: 'ready'
            });
        }, 3000)
    }

    resizeThenUpload(file) {
        const width = NumConstants.CANVAS.width
        const width_ratio = NumConstants.CANVAS.width_ratio
        const data_ratio = NumConstants.CANVAS.data_ratio

        ImageData.resizeImage(file, width, width_ratio, data_ratio).then((photoData) => {
            this.updateElemState({
                photo: photoData,
                photo_status: 'resized'
            });
            this.startUpload(photoData);
        });
    }

    onDrop(files) {
        const file = files[0];

        this.updateElemState({
            photo_status: 'file'
        });
        this.resizeThenUpload(file);
    }

    onRetry() {
        const elem = this.state.elem;
        if (elem.photo_status === 'error') {
            this.startUpload(elem.photo);
        }
    }

    componentDidMount() {
        const elem = this.state.elem;

        if (elem.photo_status === 'file') {
            const file = elem.photo;
            this.resizeThenUpload(file)
        }
    }

    render() {
        if (this.props.renderReadOnly) {
            return this.renderReadOnly();
        }

        const photo = this.state.elem.photo;
        const photo_status = this.state.elem.photo_status || 'ready';
        let PhotoPreview = <div />;

        // file 的时候只能用photo.preview (photo 是 File 对象)拿到预览。
        // resized 之后，可以用 photo (base64数据)
        const src = photo_status === 'file' ? photo.preview : photo;
        PhotoPreview = <img className="preview" ref="previewImage" src={src}/>;

        let PhotoMask = <div />;
        let MaskTips = <div />;
        if (photo_status !== 'ready') {
            switch(photo_status) {
                case 'file':
                    MaskTips = <div>Loading...</div>;
                    break;
                case 'resized':
                    MaskTips = <div>Loaded and resized.</div>;
                    break;
                case 'oversize':
                    MaskTips = <div>Over 5M, please compress the image to below 5M</div>;
                    break;
            }
            PhotoMask = (
                <div className="photoMask">
                    <div className="maskTips">{MaskTips}</div>
                </div>
            );
        }

        const opacity = this.props.isDragging ? 0 : 1;
        const dzStyle = {
            'lineHeight': '0px'
        };
        const isFirst = this.props.isFirst;
        const connectDragSource = this.props.connectDragSource;
        return ElemDnD.compWrapper(this,
            <div className="ElemPhoto" style={{opacity}} onClick={this.onBodyClick.bind(this)}>
                <div className="photoPreview">
                    <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop.bind(this)} style={dzStyle}>
                        <img src={changePhoto} className="FormIcon" />
                    </Dropzone>

                    {PhotoPreview}

                    {PhotoMask}

                </div>

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
        const photo = this.state.elem.photo;
        return (
            <div className="ElemPhoto readonly" >
                <div className="photoPreview">
                    <img className="preview" ref="previewImage" src={photo}/>
                </div>
            </div>
        );
    }
}

