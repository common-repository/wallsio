import PropTypes from "prop-types";
import classnames from "classnames";

import { toInt } from "../../../shared/util";

import { Component } from "@wordpress/element";
import { FocusableIframe, ResizableBox } from "@wordpress/components";

export default class WallsioPreview extends Component {
  static propTypes = {
    minHeight: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
    defaultHeight: PropTypes.number.isRequired,
    preview: PropTypes.shape({
      html: PropTypes.string.isRequired,
    }).isRequired,
    details: PropTypes.shape({
      height: PropTypes.number,
    }).isRequired,
    changeDetail: PropTypes.func.isRequired,
    toggleSelection: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    wallUrl: PropTypes.string.isRequired,
  };

  getHeight() {
    const height = this.props.details.height;
    return this.toValidHeight(height);
  }

  toValidHeight(height) {
    height = toInt(height, this.props.defaultHeight);

    if (height < this.props.minHeight) {
      return this.props.minHeight;
    }

    if (height > this.props.maxHeight) {
      return this.props.maxHeight;
    }

    return height;
  }

  onResizeStop(event, direction, elt, delta) {
    const deltaHeight = toInt(delta.height, 0);
    const newHeight = this.getHeight() + deltaHeight;

    this.props.changeDetail("height", newHeight);
    this.props.toggleSelection(true);
  }

  iframeUrl() {
    const url = this.props.wallUrl;

    // Remove the height, so there's no rerendering
    return url.replace(/embedheight=[0-9]+[&]?/, "");
  }

  render() {
    const title = wp.blocks.parseWithAttributeSchema(this.props.preview.html, {
      source: "attribute",
      selector: "iframe",
      attribute: "title",
    });

    const classes = classnames(
      this.props.className,
      "wallsio-wallsio-block-preview",
      { "is-selected": this.props.isSelected }
    );

    return (
      <ResizableBox
        className={ classes }
        size={ { height: this.getHeight() } }
        minHeight={ this.props.minHeight }
        enable={ { bottom: true } }
        onResizeStop={ (...args) => this.onResizeStop(...args) }
        onResizeStart={ () => this.props.toggleSelection(false) }
      >
        <FocusableIframe
          src={ this.iframeUrl() }
          allowfullscreen="allowfullscreen"
          frameborder="0"
          title={ title }
          border="0"
		  allow="camera"
        />
      </ResizableBox>
    );
  }
}
