import { defaultDetails, restrictions } from "../config";
import { parseInput } from "../InputParser";
import icon from "../logo";
import WallsioPlaceholder from "./WallsioPlaceholder";
import {
  fromDetails,
  initialWallUrl,
  initialWallUrlWithDetails,
  toDetails,
} from "../../../shared/WallUrl";
import WallsioLoading from "./WallsioLoading";
import WallsioControls from "./WallsioControls";
import WallsioPreview from "./WallsioPreview";

import {
  Component,
  Fragment,
} from "@wordpress/element";
import { BlockControls } from "@wordpress/editor";
import {
  IconButton,
  Toolbar,
} from "@wordpress/components";
import { _x } from "@wordpress/i18n";

export default class WallsioEdit extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      tmpWallIdentifier: null,
      isWallChanged: false,
      isEditing: false,
      details: toDetails(this.props.attributes.wallUrl),
    };
  }

  className = "wp-block-wallsio-wallsio";

  changeDetail(field, value) {
    const details = toDetails(this.props.attributes.wallUrl);
    details[field] = value;

    const wallUrl = fromDetails(details);

    this.props.setAttributes({
      wallUrl,
    });
  }

  onWallChange(evt) {
    if (evt) {
      evt.preventDefault();
    }

    const value = evt.target.value;
    const parsed = parseInput(value);

    this.setState({
      tmpWallIdentifier: parsed,
    });
  }

  getPropsWallIdentifier() {
    const { wallIdentifier } = toDetails(this.props.attributes.wallUrl);
    return wallIdentifier || null;
  }

  switchToUrlInput() {
    this.setState({
      isEditing: true,
      tmpWallIdentifier: this.getPropsWallIdentifier(),
    });
  }

  getNewWallUrl() {
    const wallIdentifier = this.state.tmpWallIdentifier;

    if (this.props.attributes.wallUrl) {
      const details = toDetails(this.props.attributes.wallUrl);
      return initialWallUrlWithDetails(wallIdentifier, details);
    }

    return initialWallUrl(wallIdentifier);
  }

  onSubmit(evt) {
    if (evt) {
      evt.preventDefault();
    }

    // People trying to submit empty values :)
    if (!this.state.tmpWallIdentifier) {
      return;
    }

    const newWallUrl = this.getNewWallUrl();

    this.props.setAttributes({
      wallUrl: newWallUrl,
    });

    this.props.tryAgain();

    this.setState({
      tmpWallIdentifier: null,
      isEditing: false,
    });
  }

  tryAgain(evt) {
    if (evt) {
      evt.preventDefault();
    }

    this.props.tryAgain();
  }

  hasError() {
    const wasEdited = this.state.tmpWallIdentifier !== null;

    // !wasEdited: if the user changed the input, the error is outdated, so we hide it
    // wallUrl:    there's a URL for which we could show a preview
    // !preview    … but there's no preview for it, so it must be an error
    return !wasEdited && this.props.attributes.wallUrl && !this.props.preview;
  }

  render() {
    if (this.props.isFetching) {
      return (
        <WallsioLoading />
      );
    }

    const value = this.state.tmpWallIdentifier === null ? this.getPropsWallIdentifier() : this.state.tmpWallIdentifier;

    if (this.state.isEditing || !this.props.preview) {
      return (
        <WallsioPlaceholder
          className={ this.className }
          hasError={ this.hasError() }
          icon={ icon }
          label="Embed a Walls.io wall"
          onSubmit={ (evt) => this.onSubmit(evt) }
          value={ value }
          onChange={ (evt) => this.onWallChange(evt) }
        />
      );
    }

    const details = toDetails(this.props.attributes.wallUrl);

    return (
      <Fragment>
        <BlockControls>
          <Toolbar>
            <IconButton
              className="components-toolbar__control"
              label={ _x("Change Wall", "icon label", "wallsio") }
              icon="edit"
              onClick={ () => this.switchToUrlInput() }
            />
          </Toolbar>
        </BlockControls>

        <WallsioControls
          details={ details }
          changeDetail={ (field, val) => this.changeDetail(field, val) }
          minHeight={ restrictions.minHeight }
          maxHeight={ restrictions.maxHeight }
          defaultHeight={ defaultDetails.height }
        />

        <WallsioPreview
          className={ this.className }
          details={ details }
          preview={ this.props.preview } // We know `this.props.preview` contains data
          changeDetail={ (field, val) => this.changeDetail(field, val) }
          toggleSelection={ this.props.toggleSelection }
          isSelected={ this.props.isSelected }
          minHeight={ restrictions.minHeight }
          maxHeight={ restrictions.maxHeight }
          defaultHeight={ defaultDetails.height }
          wallUrl={ this.props.attributes.wallUrl }
        />
      </Fragment>
    );
  }
}
