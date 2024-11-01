import { Component } from "@wordpress/element";
import { Spinner } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export default class WallsioLoading extends Component {
  render() {
    return (
      <div className="wp-block-embed is-loading">
        <Spinner />
        <p>{ __("Embedding…", "default") }</p>
      </div>
    );
  }
}
