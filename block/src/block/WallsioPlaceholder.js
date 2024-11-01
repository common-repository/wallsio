import PropTypes from "prop-types";
import classnames from "classnames";

import { generateId } from "../random";

import { Placeholder, Button } from "@wordpress/components";
import { BlockIcon } from "@wordpress/editor";
import { Component, Fragment } from "@wordpress/element";
import { __, _x } from "@wordpress/i18n";

export default class WallsioPlaceholder extends Component {
  static propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  state = {
    inputId: generateId("wallsio-wallidentifier-input"),
    wallIdentifier: "",
  };

  render() {
    const { icon, label, value, onSubmit, onChange } = this.props;

    const className = classnames(
      this.props.className,
      { "wallsio-has-error": this.props.hasError }
    );

    return (
      <Placeholder
        className={ className }
        icon={ <BlockIcon icon={ icon } showColors /> }
        label={ label }
      >
        <form onSubmit={ onSubmit }>
          <div className="wallsio-input-section">
            <div className="wallsio-input-group wallsio-input-group-left">
              <label htmlFor={ this.state.inputId } className="wallsio-input-group-addon wallsio-input-group-addon-left">my.walls.io /</label>
              <input
                type="text"
                className="wallsio-input wallsio-input-right wallsio-url-input"
                id={ this.state.inputId }
                value={ value }
                placeholder={ _x("Enter Wall URL here…", "input placeholder", "wallsio") }
                onChange={ onChange }
              />
            </div>
          </div>

          <Button
            isLarge
			isPrimary
            type="submit">
            { _x("Embed", "button label") }
          </Button>
        </form>

        <div className="wallsio-wallsio-input-info">
          { this.renderError() }
          { this.renderSignupHint() }
        </div>
      </Placeholder>
    );
  }

  renderSignupHint() {
    const url = "https://walls.io/sign-up?utm_source=plugin&utm_medium=cta&utm_campaign=wordpress";

    return (
      <div className="wallsio-hint components-placeholder__instructions">
        { _x("If you don't have a wall yet, create one at Walls.io.", "signup instruction", "wallsio") }
        <br />
        <a href={ url } target="_blank" rel="noopener noreferrer">
          { _x("Sign up here", "link text", "wallsio") }
        </a>
        { _x(" – we offer a free trial", "signup instruction", "wallsio") }
      </div>
    );
  }

  renderError() {
    if (!this.props.hasError) {
      return null;
    }

    return (
      <Fragment>
        <p className="components-placeholder__error">
          { __("Sorry, this wall doesn't exist or is not public.", "wallsio") }
          <br />
        </p>
      </Fragment>
    );
  }
}
