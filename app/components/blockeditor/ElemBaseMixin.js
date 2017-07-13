'use strict';

import React from 'react';
import _ from 'lodash';

export default class ElemBaseMixin extends React.Component {

    constructor() {
        super();
        this.state = {
            elem: null
        };
    }

    componentWillMount() {
        this.setState(_.assign(this.state, {
            elem: this.props.elem
        }));
    }
    componentWillReceiveProps (nextProps, nextStae) {
        this.setState(_.assign(this.state, {
            elem: nextProps.elem
        }));
    }
    componentDidMount() {
        if (this.props.focus && this.focus) {
            this.focus();
        }
    }

    onAddText() {
        this.props.onAddText(this.props.elem, 'Text');
    }
    onAddLink() {
        // 弹出链接输入框
        this.props.onPopup(this.props.elem, 'ElemLinkInput', 'add');
    }
    onAddPhoto (file) {
        this.props.onAddPhoto(this.props.elem, file);
    }
    onAddLocation() {
        // 弹出地图输入框
        this.props.onPopup(this.props.elem, 'ElemLocationInput', 'add');
    }
    onDelElem() {
        this.props.onDelElem(this.props.elem);
    }

    onEditLink() {
        this.props.onPopup(this.props.elem, 'ElemLinkInput', 'edit');
    }
    onEditLocation() {
        this.props.onPopup(this.props.elem, 'ElemLocationInput', 'edit');
    }

    // 点击空白处，把点击事件传递给 toolbar
    onBodyClick() {
        if (this.refs.toolbar) {
            this.refs.toolbar.onBodyClick();
        }
    }

}

ElemBaseMixin.propTypes = {
    uniqId: React.PropTypes.string.isRequired,
    elem: React.PropTypes.object.isRequired
};

