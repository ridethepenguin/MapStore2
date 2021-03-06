/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const {Button, Col, Grid, Row, Image, Glyphicon, Table} = require('react-bootstrap');
const {DateFormat} = require('../../I18N/I18N');
require("./style.css");
const ConfigUtils = require('../../../utils/ConfigUtils');
const shotingImg = require('./shoting.gif');
const notAvailable = require('./not-available.png');
const {isEqual} = require('lodash');
const SnapshotSupport = require('./SnapshotSupport');
const BasicSpinner = require('../../misc/spinners/BasicSpinner/BasicSpinner');
/**
 * SnapshotPanel allow to export a snapshot of the current map, showing a
 * preview of the snapshot, with some info about the map.
 * It prevent the user to Export snapshot with Google or Bing backgrounds.
 * It shows also the status of the current snapshot generation queue.
 */
let SnapshotPanel = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        saveBtnText: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        map: ConfigUtils.PropTypes.config,
        layers: React.PropTypes.array,
        img: React.PropTypes.object,
        snapshot: React.PropTypes.object,
        active: React.PropTypes.bool,
        status: React.PropTypes.string,
        browser: React.PropTypes.object,
        onStatusChange: React.PropTypes.func,
        onCreateSnapshot: React.PropTypes.func,
        downloadImg: React.PropTypes.func,
        serviceBoxUrl: React.PropTypes.string,
        dateFormat: React.PropTypes.object,
        googleBingErrorMsg: React.PropTypes.node,
        downloadingMsg: React.PropTypes.node,
        timeout: React.PropTypes.number
    },
    getDefaultProps() {
        return {
            id: "snapshot_panel",
            layers: [],
            snapshot: { state: "DISABLED", img: {}},
            browser: {},
            icon: <Glyphicon glyph="camera"/>,
            onStatusChange: () => {},
            onCreateSnapshot: () => {},
            downloadImg: () => {},
            saveBtnText: "Save",
            serviceBoxUrl: null,
            dateFormat: {day: "numeric", month: "long", year: "numeric"},
            googleBingErrorMsg: "snapshot.googleBingError",
            downloadingMsg: "snapshot.downloadingSnapshots",
            timeout: 1000
        };
    },
    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.layers, this.props.layers) || (nextProps.active !== this.props.active) || nextProps.map !== this.props.map || this.props.snapshot !== nextProps.snapshot;
    },
    renderLayers() {
        let items = this.props.layers.map((layer, i) => {
            if (layer.visibility) {
                return (<li key={i}>{layer.title}</li>);
            }
        });
        return items;
    },
    renderButton(enabled) {
        return (<Button bsSize="xs" disabled={!enabled}
                onClick={this.onClick}>
                <Glyphicon glyph="floppy-save" disabled={{}}/>{this.props.saveBtnText}
                </Button>);
    },
    renderError() {
        if (this.props.snapshot.error) {
            return (<Row className="text-center" style={{marginTop: "5px"}}>
                    <h4><span className="label label-danger"> {this.props.snapshot.error}
                    </span></h4></Row>);
        }else if (this.isBingOrGoogle()) {
            return (<Row className="text-center" style={{marginTop: "5px"}}>
                    <h4><span className="label label-danger">{this.getgoogleBingError()}
                    </span></h4></Row>);
        }

    },
    mapIsLoading(layers) {
        return layers.some((layer) => layer.loading);
    },
    renderPreview() {
        let bingOrGoogle = this.isBingOrGoogle();
        let snapshotReady = this.isSnapshotReady();
        let replaceImage;
        if (!bingOrGoogle) {
            replaceImage = shotingImg;
        } else {
            replaceImage = notAvailable;
        }

        return [(
            <div style={{display: snapshotReady && !bingOrGoogle ? "block" : "none" }} key="snapshotPreviewContainer">
                { !bingOrGoogle ? (<SnapshotSupport.Preview
                ref="snapshotPreview"
                timeout={this.props.timeout}
                config={this.props.map}
                layers={this.props.layers.filter((l) => {return l.visibility; })}
                snapstate={this.props.snapshot}
                onStatusChange={this.props.onStatusChange}
                active={this.props.active && !bingOrGoogle}
                allowTaint={true}
                drawCanvas={snapshotReady && !bingOrGoogle}
                browser={this.props.browser}/>) : null}
            </div>),
            (<Image key="snapshotLoader" src={replaceImage} style={{margin: "0 auto", display: snapshotReady && !bingOrGoogle ? "none" : "block" }} responsive/>)
            ];
    },
    renderSize() {
        return this.props.map.size.width + " X " + this.props.map.size.height;
    },
    renderSnapshotQueue() {
        if (this.props.snapshot.queue && this.props.snapshot.queue.length > 0) {
            return (<div key="counter" style={{margin: "20px"}}>{this.renderDownloadMessage()}<BasicSpinner value={this.props.snapshot.queue.length} /> </div>);
        }
    },
    renderDownloadMessage() {
        return this.props.downloadingMsg;
    },
    render() {
        let bingOrGoogle = this.isBingOrGoogle();
        let snapshotReady = this.isSnapshotReady();
        return ( this.props.active ) ? (
            <Grid header={this.props.name} className="snapshot-panel" fluid={true}>
                <Row key="main">
                    <Col key="previewCol" xs={7} sm={7} md={7}>{this.renderPreview()}</Col>
                    <Col key="dataCol" xs={5} sm={5} md={5}>
                       <Table responsive>
                            <tbody>
                               <tr>
                                <td>Date</td><td> <DateFormat dateParams={this.props.dateFormat}/></td>
                                </tr>
                                <tr><td>Layers</td><td><ul>{this.renderLayers()}</ul></td></tr>
                                <tr><td>Size</td><td>{this.renderSize()}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                {this.renderError()}

                <Row key="buttons" htopclassName="pull-right" style={{marginTop: "5px"}}>
                    { this.renderButton(!bingOrGoogle && snapshotReady)}
                    {this.renderSnapshotQueue()}
                </Row>

            </Grid>
        ) : null;
    },
    onClick() {
        if (this.refs.snapshotPreview.isTainted()) {
            this.createSnapshot();
        } else {
            let dataURL = this.refs.snapshotPreview.exportImage();
            this.props.downloadImg(dataURL);
        }
    },
    createSnapshot() {
        this.props.onCreateSnapshot({
            key: new Date().getUTCMilliseconds(), // create a unique key for this snapshot
            config: this.props.map,
            layers: this.props.layers.filter((l) => {return l.visibility; }),
            snapstate: this.props.snapshot,
            active: this.props.active,
            allowTaint: false,
            drawCanvas: true,
            browser: this.props.browser
        });
    },
    isBingOrGoogle() {
        return this.props.layers.some((layer) => {
            return (layer.type === 'google' && layer.visibility ) || (layer.type === 'bing' && layer.visibility );
        });
    },
    getgoogleBingError() {
        return this.props.googleBingErrorMsg;
    },
    isSnapshotReady() {
        return this.props.snapshot.state === "READY" && !this.mapIsLoading(this.props.layers);
    }
});

module.exports = SnapshotPanel;
