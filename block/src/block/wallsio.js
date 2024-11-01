/**
 * BLOCK: block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import "./style.scss";
import "./editor.scss";
import { toWallBaseUrl } from "../../../shared/WallUrl";
import icon from "../logo";
import createWallBlock from "./createWallBlock";
import WallsioEdit from "./WallsioEdit";
import { parseDomNode, parseText, parseUrl } from "../InputParser";

import { registerBlockType } from "@wordpress/blocks";
import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { _x } from "@wordpress/i18n";

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("wallsio/wallsio", {
  title: _x("Walls.io", "block title", "wallsio"),
  description: _x("Embed your social wall", "block description", "wallsio"),
  icon: icon,
  category: "embed", // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [
    _x("social wall", "block keyword", "wallsio"),
    _x("wallsio: twitter instagram feed", "block keyword", "wallsio"),
    _x("social media aggregator", "block keyword", "wallsio"),
  ],

  attributes: {
    wallUrl: {
      type: "string",
      source: "text",
      default: "",
    },
  },

  edit: compose(
    // Heavily influenced by Gutenberg default embeds
    // https://github.com/WordPress/gutenberg/blob/4c35fa4fcaf/packages/block-library/src/embed/settings.js
    withSelect((select, ownProps) => {
      const { wallUrl } = ownProps.attributes;
      const baseUrl = toWallBaseUrl(wallUrl);

      const core = select("core");
      const { getEmbedPreview, isRequestingEmbedPreview } = core;

      const preview = baseUrl ? getEmbedPreview(baseUrl) : null;
      const isFetching = baseUrl ? isRequestingEmbedPreview(baseUrl) : false;

      const isValidPreview = !!preview && preview.type === "rich" && !!preview.html;

      return {
        preview: isValidPreview ? preview : null,
        isFetching,
      };
    }),

    withDispatch((dispatch, ownProps) => {
      const coreData = dispatch("core/data");

      const { wallUrl } = ownProps.attributes;
      const baseUrl = toWallBaseUrl(wallUrl);

      const tryAgain = () => {
        coreData.invalidateResolution("core", "getEmbedPreview", [baseUrl]);
      };

      return {
        tryAgain,
      };
    })
  )(WallsioEdit),

  /**
   * https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-registration/#supports-optional
   */
  supports: {
    customClassName: false, // This field ist just annoying
    align: false, // Everybody wants to have nice aligns
  },

  save: (props) => {
    const { attributes: { wallUrl } } = props;

    return (
      <figure className="wp-block-embed is-type-rich is-provider-walls-io wallsio-is-plugin-used">
        { `\n${wallUrl}\n` /* URL needs to be on its own line. */ }
      </figure>
    );
  },

  transforms: {
    from: [
      {
        type: "raw",
        priority: 1,
        isMatch: (node) => {
          return !!parseDomNode(node);
        },
        transform: (node) => {
          const wallIdentifier = parseDomNode(node); // This always works if `isMatch` returns `true`
          return createWallBlock(wallIdentifier);
        },
      },
      {
        type: "block",
        priority: 1,
        blocks: ["core/code", "core/html", "core/paragraph"],
        isMatch: ({ content }) => {
          return !!parseText(content);
        },
        transform: ({ content }) => {
          const wallIdentifier = parseText(content);
          return createWallBlock(wallIdentifier);
        },
      },
      {
        type: "block",
        priority: 1,
        blocks: ["core/embed"],
        isMatch: ({ url }) => {
          return !!parseUrl(url);
        },
        transform: ({ url }) => {
          const wallIdentifier = parseUrl(url);
          return createWallBlock(wallIdentifier);
        },
      },
    ],
  },
});
