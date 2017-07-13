'use strict';

import React from 'react';
import when from 'when';
import _ from 'lodash';

import {Modal, Button} from 'react-bootstrap';

import '../styles/ElemLocationMap.css';

import searchImage from '../images/search_icon.png';
import cross from '../images/white_cross.png';
import check from '../images/white_check.png';

let mapObj = null;
let initialized = false;

const initLocation = (currPoi) => {
    let center, zoom = 13;
    if (currPoi && currPoi.location) {
        center = new AMap.LngLat(currPoi.location.lng, currPoi.location.lat);
        zoom = 18;
    }
    mapObj = new AMap.Map('mapContainer', {
        resizeEnable: true,
        view: new AMap.View2D({
            resizeEnable: true,
            center: center,
            zoom: zoom //地图显示的缩放级别
        }),
        keyboardEnable: false
    });

    if (currPoi && currPoi.location) {
        const mar = new AMap.Marker({
            map: mapObj,
            icon: 'http://webapi.amap.com/images/marker_sprite.png',
            position: new AMap.LngLat(currPoi.location.lng, currPoi.location.lat)
        });
        mapObj.setFitView();
    }
};

//输入提示
const search = (keyword) => {
    return when.promise((resolve, reject) => {
        AMap.service(['AMap.Autocomplete'], () => {
            resolve();
        });
    }).then(() => {
        return when.promise((resolve, reject) => {
            const auto = new AMap.Autocomplete({
                city: '' //城市，默认全国
            }).search(keyword, (status, result) => {
                resolve(result);
            });
        });
    });
};

//从输入提示框中选择关键字并查询
const selectResult = (adcode, name) => {
    return when.promise((resolve, reject) => {
        mapObj.plugin(['AMap.PlaceSearch'], () => {
            resolve();
        });
    }).then(() => {
        return when.promise( (resolve, reject) => {
            const msearch = new AMap.PlaceSearch({extensions: 'all'});  //构造地点查询类
            AMap.event.addListener(msearch, 'complete', (data) => {
                resolve(data);
            });
            msearch.setCity(adcode);
            msearch.search(name);  //关键字查询查询
        });
    }).then((data) => {
        return when.promise((resolve, reject) => {
            mapObj.clearMap();
            const poiArr = data.poiList.pois;
            const currPoi = poiArr[0];
            const lngX = currPoi.location.getLng();
            const latY = currPoi.location.getLat();
            const mar = new AMap.Marker({
                map: mapObj,
                icon: 'http://webapi.amap.com/images/marker_sprite.png',
                position: new AMap.LngLat(lngX, latY)
            });
            mapObj.setFitView();
            resolve(currPoi);
        });
    });
};

export default class ElemLocationMap extends React.Component {

    constructor () {
        super();
        this.state = {
            keyword: '',
            place: {},
            showSearchResult: false,
            searchResultList: [],
            selectedResult: ''
        };
    }

    changeKeyword () {
        var keyword = this.keywordInput.value;
        this.setState(_.assign(this.state, {
            keyword: keyword,
            showSearchResult: true
        }));
        if (keyword) {
            search(keyword).then(function (result) {
                var searchResultList = [];
                this.setState(_.assign(this.state, {
                    searchResultList: result.tips || []
                }));
            }.bind(this));
        }
    }

    selectResult (adcode, name) {
        selectResult(adcode, name).then(function (currPoi) {
            var place = {
                id: currPoi.id,
                name: currPoi.name,
                location: {
                    lat: currPoi.location.lat,
                    lng: currPoi.location.lng
                },
                country: '中国',
                aal1: currPoi.pname,
                aal2: currPoi.cityname,
                aal3: currPoi.adname,
                address: currPoi.address || 'none',
                tel: currPoi.tel || 'none'
            };

            this.props.onChange('locationMapModal', {
                place
            });

            this.setState(_.assign(this.state, {
                place: place,
                searchResultList: [],
                showSearchResult: false
            }));
        }.bind(this));
    }

    componentWillUnmount () {
        initialized = false;
    }

    componentDidMount () {
        const newState = _.assign(this.state, {
            place: this.props.place,
            keyword: this.props.place.name
        });
        this.setState(newState);
    }
    componentWillReceiveProps (nextProps, nextState) {
        const newState = _.assign(this.state, {
            place: nextProps.place,
            keyword: nextProps.place.name
        });
        this.setState(newState);
    }

    confirmThisModal () {
        const place = this.state.place;
        this.props.onConfirm(place);
    }

    cancelThisModal () {
        this.props.onCancel('locationMapModal');
    }

    render () {
        if (!this.props.isOpen) {
            initialized = false;
        } else if (!initialized && this.props.isOpen) {
            window.requestAnimationFrame(function () {
                initLocation(this.state.place);
                initialized = true;
            }.bind(this));
        }

        let SearchResults = [];
        if (this.state.showSearchResult) {
            SearchResults = this.state.searchResultList.map(function (r) {
                return (
                    <li onClick={this.selectResult.bind(this, r.adcode, r.name)} key={r.adcode + r.name}>
                        <span className="name">{r.name}({r.district})</span>
                    </li>
                );
            }.bind(this));
        }

        return (
            <div>
                <Modal
                    show={this.props.isOpen}
                    animation={false}
                    dialogClassName='ElemLocationMap'
                    >
                    <Modal.Body className='ElemLocationMapBody'>
                        <div id='search'>
                            <img src={searchImage} className="FormIcon" />
                            <input
                                type='text'
                                ref={(input) => { this.keywordInput = input; }}
                                placeholder='请输入'
                                value={this.state.keyword || ''}
                                onChange={this.changeKeyword.bind(this)} />
                        </div>

                        {
                            this.state.showSearchResult ?
                            <ul className='searchResult'>
                                {SearchResults}
                            </ul>
                            :
                            <div />
                        }


                        <div id={'mapContainer'}></div>

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

ElemLocationMap.propTypes = {
    isOpen: React.PropTypes.bool.isRequired
};


