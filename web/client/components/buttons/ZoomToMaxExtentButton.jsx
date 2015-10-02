/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var BootstrapReact = require('react-bootstrap');
var Button = BootstrapReact.Button;
var Glyphicon = BootstrapReact.Glyphicon;

const mapUtils = require('../../utils/MapUtils');
const configUtils = require('../../utils/ConfigUtils');


/**
 * A button to zoom to max. extent of the map or zoom level one.
 * Component's properies:
 *  - id: {string}            custom identifier for this component
 *  - style: {object}         a css-like hash to define the style on the component
 *  - glyphicon: {string}     bootstrap glyphicon name
 *  - text: {string|element}  text content for the button
 *  - btnSize: {string}       bootstrap button size ('large', 'small', 'xsmall')
 */
var ZoomToMaxExtentButton = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        style: React.PropTypes.object,
        glyphicon: React.PropTypes.string,
        text: React.PropTypes.string,
        btnSize: React.PropTypes.oneOf(['large', 'medium', 'small', 'xsmall']),
        mapConfig: React.PropTypes.object,
        actions: React.PropTypes.shape({
            changeMapView: React.PropTypes.func
        })
    },
    getDefaultProps() {
        return {
            id: "mapstore-zoomtomaxextent",
            style: undefined,
            glyphicon: "resize-full",
            text: undefined,
            btnSize: 'xsmall'
        };
    },
    render() {
        return (
            <Button
                id={this.props.id}
                bsStyle="default"
                bsSize={this.props.btnSize}
                onClick={() => this.zoomToMaxExtent()}>
                {this.props.glyphicon ? <Glyphicon glyph={this.props.glyphicon}/> : null}
                {this.props.glyphicon && this.props.text ? "\u00A0" : null}
                {this.props.text}
            </Button>
        );
    },
    zoomToMaxExtent() {
        var mapConfig = this.props.mapConfig;
        var maxExtent = mapConfig.maxExtent;
        var mapSize = this.props.mapConfig.size;
        var newZoom = 1;
        var newCenter = this.props.mapConfig.center;
        var proj = "EPSG:900913";

        if (maxExtent &&
            Object.prototype.toString.call(maxExtent) === '[object Array]') {
            // zoom by the max. extent defined in the map's config
            newZoom = mapUtils.getZoomForExtent(maxExtent, mapSize, 0, 21);

            // center by the max. extent defined in the map's config
            newCenter = mapUtils.getCenterForExtent(maxExtent, proj);

            // do not reproject for 0/0
            if (newCenter.x !== 0 || newCenter.y !== 0) {
                // reprojects the center object
                newCenter = configUtils.getCenter(newCenter, proj);
            }

        }

        // adapt the map view by calling the corresponding action
        this.props.actions.changeMapView(newCenter, newZoom,
            this.props.mapConfig.bbox, this.props.mapConfig.size);

    }
});

module.exports = ZoomToMaxExtentButton;
