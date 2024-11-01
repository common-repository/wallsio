import PropTypes from "prop-types";

import { toInt } from "../../../shared/util";

import { Component } from "@wordpress/element";
import { InspectorControls } from "@wordpress/editor";
import { PanelBody, PanelRow, TextControl, ToggleControl } from "@wordpress/components";
import { _x } from "@wordpress/i18n";

export default class WallsioControls extends Component {
  static propTypes = {
    changeDetail: PropTypes.func.isRequired,
    defaultHeight: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    details: PropTypes.shape({
      height: PropTypes.number,
    }).isRequired,
  };

  onHeightChange(newHeight) {
    const intHeight = toInt(newHeight);
    this.props.changeDetail("height", intHeight);
  }

  render() {
    return (
      <InspectorControls>
        <PanelBody
          title={ _x("Walls.io settings", "panel headline", "wallsio") }
          className="wallsio-components-panel__body"
        >
          <PanelRow>
            <TextControl
              label={ _x("Height in pixels", "input label", "wallsio") }
              value={ this.props.details.height }
              type="number"
              min={ this.props.minHeight }
              max={ this.props.maxHeight }
              step="10"
              onChange={ (newHeight) => this.onHeightChange(newHeight) }
            />
          </PanelRow>
          <PanelRow>
            <ToggleControl
              label={ _x("Show background", "input label", "wallsio") }
              checked={ this.props.details.showBackground }
              onChange={ (val) => this.props.changeDetail("showBackground", val) }
            />
          </PanelRow>
          <PanelRow>
            <ToggleControl
              label={ _x("Show header", "input label", "wallsio") }
              checked={ this.props.details.showHeader }
              onChange={ (val) => this.props.changeDetail("showHeader", val) }
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    );
  }
}
