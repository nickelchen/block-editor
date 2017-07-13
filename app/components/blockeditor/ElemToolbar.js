'use strict';

import React from 'react';
import Dropzone from 'react-dropzone';

import _ from 'lodash';

import './styles/ElemToolbar.css';

import addLinkImage from './images/elem_link.png';
import addLocationImage from './images/elem_place.png';
import addPhotoImage from './images/elem_photo.png';
import addTextImage from './images/elem_text.png';
import addImage from './images/elem_add.png';

export default class ElemToolbar extends React.Component {
    constructor() {
        super();
        this.state = {
            showTools: false,
            showLinkInput: false
        };
    }

    onMouseEnter(e) {
        e.target.style.top = '-5px';
    }
    onMouseLeave(e) {
        e.target.style.top = '0px';
    }

    // 4个 add 事件代理给父组件，即 ElemText ElemPhoto ElemLocation ElemLink 等等
    addLink(e) {
        e.stopPropagation();
        this.props.addLink();
    }

    addText(e) {
        e.stopPropagation();
        this.props.addText();
    }

    addLocation(e) {
        e.stopPropagation();
        this.props.addLocation();
    }

    toggleToolbar(e) {
        e.stopPropagation();
        // 第一个工具条一直显示
        this.setState(_.assign(this.state, {
            showTools: !this.state.showTools || this.props.isFirst
        }));
    }

    onBodyClick() {
        if (!this.props.isFirst) {
            this.setState(_.assign(this.state, {
                showTools: false
            }));
        }
    }

    onBeforeDrop(e) {
    }

    onDrop(files) {
        const file = files[0];
        this.props.addPhoto(file);
    }

    componentWillReceiveProps(nextProps) {
        // 第一个工具条一直显示
        this.setState(_.assign(this.state, {
            showTools: nextProps.isFirst
        }));
    }
    componentDidMount() {
        // 第一个工具条一直显示
        this.setState(_.assign(this.state, {
            showTools: this.props.isFirst
        }));
    }


    render() {
        let visibleTool = ['photo', 'location', 'link', 'text'];

        // 添加按钮的样式
        const addStyle = { opacity: 1, display: 'block'};
        // 工具条的总长度
        const toolbarLength = 180;
        // 每个工具图标的半径
        const iconRadius = 15;

        const eachLength = toolbarLength / (visibleTool.length - 1);
        const halfPoint = toolbarLength / 2;

        let eachStyles = _.map(visibleTool, (name, i) => {
            return {
                        top: '0px',
                        opacity: 0,
                        left: '-15px'
                    };
        });

        if (this.state.showTools) {
            eachStyles = _.map(visibleTool, (name, i) => {
                return _.assign({
                            top: '0px',
                            opacity: 0,
                            left: '-15px'
                        }, {
                            opacity: 1,
                            left: i * eachLength - halfPoint - iconRadius + 'px'
                        });
            });

            addStyle.display = 'none';
            addStyle.opacity = 0;
            addStyle.cursor = 'auto';
        }


        let LinkTool = <div />;
        let index = _.findIndex(visibleTool, (e) => { return e === 'link'; });
        if (index !== -1) {
            LinkTool = <img src={addLinkImage} className="FormIcon Link"
                            style={eachStyles[index]}
                            onClick={this.addLink.bind(this)}
                            onMouseEnter={this.onMouseEnter.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)} />;
        }

        let LocationTool = <div />;
        index = _.findIndex(visibleTool, (e) => { return e === 'location'; });
        if (index !== -1) {
            LocationTool = <img src={addLocationImage} className="FormIcon Location"
                                style={eachStyles[index]}
                                onClick={this.addLocation.bind(this)}
                                onMouseEnter={this.onMouseEnter.bind(this)}
                                onMouseLeave={this.onMouseLeave.bind(this)} />;
        }

        let ImageTool = <div />;
        index = _.findIndex(visibleTool, (e) => { return e === 'photo'; });
        if (index !== -1) {
            const dzStyle = {
                'lineHeight': '0px',
                'display': 'inline-block'
            };
            ImageTool = <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)} style={dzStyle}>
                            <img src={addPhotoImage} className="FormIcon Image"
                                style={eachStyles[index]}
                                onClick={this.onBeforeDrop.bind(this)}
                                onMouseEnter={this.onMouseEnter.bind(this)}
                                onMouseLeave={this.onMouseLeave.bind(this)} />
                        </Dropzone>;
        }

        let TextTool = <div />;
        index = _.findIndex(visibleTool, (e) => { return e === 'text'; });
        if (index !== -1) {
            TextTool = <img src={addTextImage} className="FormIcon Text"
                            style={eachStyles[index]}
                            onClick={this.addText.bind(this)}
                            onMouseEnter={this.onMouseEnter.bind(this)}
                            onMouseLeave={this.onMouseLeave.bind(this)} />;
        }

        return (
            <div className="ElemToolbar">

                <div className="Tools">
                    { LinkTool }
                    { LocationTool }
                    { ImageTool }
                    { TextTool }
                </div>

                <img src={addImage} className="FormIcon Add"
                    style={addStyle}
                    onClick={this.toggleToolbar.bind(this)} />

            </div>
        );
    }
}


