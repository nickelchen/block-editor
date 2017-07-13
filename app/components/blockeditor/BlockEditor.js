'use strict';

import React from 'react';

import HTML5Backend from 'react-dnd-html5-backend';
const DragDropContext = require('react-dnd').DragDropContext;

import 'bootstrap/dist/css/bootstrap.min.css';

import ElemText from './ElemText';
import ElemLink from './ElemLink';
import ElemPhoto from './ElemPhoto';
import ElemLocation from './ElemLocation';
import ElemDnD from './ElemDnD';

const ElemPhotoWrapped = ElemDnD.dragWrapper(ElemDnD.dropWrapper(ElemPhoto));
const ElemLinkWrapped = ElemDnD.dragWrapper(ElemDnD.dropWrapper(ElemLink));
const ElemTextWrapped = ElemDnD.dragWrapper(ElemDnD.dropWrapper(ElemText));
const ElemLocationWrapped = ElemDnD.dragWrapper(ElemDnD.dropWrapper(ElemLocation));

import ElemLinkInput from './modals/ElemLinkInput';
import ElemLocationMap from './modals/ElemLocationMap';
import NumConstants from './constants/NumConstants';

import _ from 'lodash';

import './styles/BlockEditor.css';
import deleteImage from './images/elem_del.png';

let prefix = 0;
let elemIdCounter = 0;

let confirmCallback = () => {};

const _nextBlockElemId = (p) => {
    elemIdCounter++;
    let elemId = 'blockeditor_' + p + '_elems_' + elemIdCounter;
    return elemId;
};

const _compareEqual = (oldBody, newBody) => {
    return JSON.stringify(oldBody) === JSON.stringify(newBody);
};

class BlockEditor extends React.Component {
    constructor() {
        super();
        this.state = {
            body: [],
            linkInputModal: {
                link: {},
                isOpen: false
            },
            locationMapModal: {
                place: {},
                isOpen: false
            }
        };
    }

    normalizeBody(body) {
        body = body || [];
        body = _.map(body, function (elem) {
            if (elem.type === 'link') {
                elem.link = _.pick(elem.link, ['url']);
            }
            elem = _.pick(elem, ['type', 'text', 'photo', 'link', 'place']);
            return elem;
        });
        let allValid = _.every(body, (elem) => {
            switch(elem.type) {
                case 'photo':
                    return !!elem.photo;
                case 'text':
                    return !!elem.text;
                case 'link':
                    return !!elem.link.url;
                case 'place':
                    return !!elem.place.location;
            }
            return false;
        });
        if (allValid) {
            return body;
        }
        return false;
    }

    openModal(modalName) {
        let modal = this.state[modalName];
        modal.isOpen = true;
        this.setState(_.assign(this.state, {
            modalName: modal
        }));
    }
    closeModal(modalName) {
        let modal = this.state[modalName];
        modal.isOpen = false;
        this.setState(_.assign(this.state, {
            modalName: modal
        }));
    }

    setModalValue(modalName, newValue) {
        let modal = this.state[modalName];
        _.assign(modal, newValue);
        this.setState(_.assign(this.state, {
            modalName: modal
        }));
    }

    getModalValue(modalName) {
        let modal = _.cloneDeep(this.state[modalName]);
        delete modal.isOpen;
        return modal;
    }

    componentWillMount() {
    }

    componentWillUnmount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps) {
        prefix++;
        let body = newProps.body || [];

        if (body.length === 0) {
            let defaultElem = {
                type: NumConstants.ELEM_TYPE.text,
                text: ''
            };
            body.push(defaultElem);
        }

        _.each(body, (item) => {
            item.id = _nextBlockElemId(prefix);
        });

        this.setState(_.assign(this.state, {
            body
        }));
    }


    // 内部方法
    _addElemAfterTarget(target, recipe) {
        // 在target 后面添加一个元素， recipe 是构造这个元素所需的菜单
        let state = this.state;
        let body = state.body;

        let elemIndex = _.findIndex(body, (elem) => {
            return elem.id === target.id;
        });
        let newElemId = _nextBlockElemId(prefix);
        body.splice(elemIndex + 1, 0, _.assign(recipe, {
            id: newElemId,
        }));

        this.setState(state);

    }
    _delElemAtTarget(target) {
        let state = this.state;
        let body = state.body;

        let elemIndex = _.findIndex(body, (elem) => {
            return elem.id === target.id;
        });
        body.splice(elemIndex, 1);

        this.setState(state);
    }

    // 3个 弹出框 的 confirm 回调
    onAddLocation(afterWhichElem, place) {
        this._addElemAfterTarget(afterWhichElem, {
            type: NumConstants.ELEM_TYPE.place,
            place: place
        });
    }
    onEditLocation(whichElem, place) {
        this._addElemAfterTarget(whichElem, {
            type: NumConstants.ELEM_TYPE.place,
            place: place
        });
        this._delElemAtTarget(whichElem);
    }
    onAddLink(afterWhichElem, link) {
        this._addElemAfterTarget(afterWhichElem, {
            type: NumConstants.ELEM_TYPE.link,
            link: link
        });
    }
    onEditLink(whichElem, link) {
        this._addElemAfterTarget(whichElem, {
            type: NumConstants.ELEM_TYPE.link,
            link: link
        });
        this._delElemAtTarget(whichElem);
    }

    // 4个 Elem 元素的回调
    onAddPhoto(afterWhichElem, file) {
        this._addElemAfterTarget(afterWhichElem, {
            type: NumConstants.ELEM_TYPE.photo,
            photo: file,
            photo_status: 'file'
        });
    }
    onAddText(afterWhichElem) {
        this._addElemAfterTarget(afterWhichElem, {
            type: NumConstants.ELEM_TYPE.text,
            text: ''
        });
    }
    onPopup(whichElem, whichModal, addOrEdit) {
        let modalName = null;
        let newValue = {};
        if (whichModal === 'ElemLinkInput') {
            modalName = 'linkInputModal';
            if (addOrEdit === 'add') {
                confirmCallback = (link) => {
                    this.onAddLink(whichElem, link);
                    this.closeModal(modalName);
                };
                newValue = {link: {}};
            } else {
                confirmCallback = (link) => {
                    this.onEditLink(whichElem, link);
                    this.closeModal(modalName);
                };
                newValue = whichElem;
            }
        } else {
            modalName = 'locationMapModal';
            if (addOrEdit === 'add') {
                confirmCallback = (place) => {
                    this.onAddLocation(whichElem, place);
                    this.closeModal(modalName);
                };
                newValue = {place: {}};
            } else {
                confirmCallback = (place) => {
                    this.onEditLocation(whichElem, place);
                    this.closeModal(modalName);
                };
                newValue = whichElem;
            }
        }

        this.setModalValue(modalName, newValue);
        this.openModal(modalName);
        // 触发刷新
        this.setState(this.state);
    }
    onDelElem(whichElem) {
        this._delElemAtTarget(whichElem);
    }
    onReorder(sourceID, targetID) {
        let state = this.state;
        let body = state.body;

        let sourceIndex = _.findIndex(body, (elem) => {
            return elem.id === sourceID;
        });
        let targetIndex = _.findIndex(body, (elem) => {
            return elem.id === targetID;
        });
        let source = body[sourceIndex];

        body.splice(sourceIndex, 1);
        body.splice(targetIndex, 0, source);

        this.setState(state);
    }

    getElemType(elem) {
        let ElemType;
        switch(elem.type) {
            case NumConstants.ELEM_TYPE.photo:
                ElemType = ElemPhotoWrapped;
                break;
            case NumConstants.ELEM_TYPE.text:
                ElemType = ElemTextWrapped;
                break;
            case NumConstants.ELEM_TYPE.link:
                ElemType = ElemLinkWrapped;
                break;
            case NumConstants.ELEM_TYPE.place:
                ElemType = ElemLocationWrapped;
                break;
            default:
                ElemType = ElemTextWrapped;
                break;
        }
        return ElemType;
    }

    render() {
        const renderReadOnly = this.props.renderReadOnly;
        const Elems = this.state.body.map((e, i) => {
            const ElemType = this.getElemType(e);
            const isFirst = (i === 0);

            return (
                <ElemType
                    elem={e}
                    renderReadOnly={renderReadOnly}
                    onPopup={this.onPopup.bind(this)}
                    onAddText={this.onAddText.bind(this)}
                    onAddPhoto={this.onAddPhoto.bind(this)}
                    onDelElem={this.onDelElem.bind(this)}
                    onReorder={this.onReorder.bind(this)}
                    key={e.id}
                    uniqId={e.id}
                    isFirst={false}
                    />
            );
        });

        const linkInputModal = this.state.linkInputModal;
        const locationMapModal = this.state.locationMapModal;
        return (
            <div className="BlockEditor">

                {Elems}

                <ElemLinkInput
                    link={ linkInputModal.link }
                    isOpen={!!linkInputModal.isOpen}
                    onChange={this.setModalValue.bind(this)}
                    onConfirm={confirmCallback}
                    onCancel={this.closeModal.bind(this)} />

                <ElemLocationMap
                    place={ locationMapModal.place }
                    isOpen={!!locationMapModal.isOpen}
                    onChange={this.setModalValue.bind(this)}
                    onConfirm={confirmCallback}
                    onCancel={this.closeModal.bind(this)} />

            </div>
        );
    }
}

BlockEditor = DragDropContext(HTML5Backend)(BlockEditor);
BlockEditor.prototype.getManager().getBackend().handleSelectStart = () => {};

export default BlockEditor;
