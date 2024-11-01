/*global jQuery */

import "../css/tinymce.scss";

import { fromDetails as wallUrlFromDetails, toDetails as wallUrlToDetails } from '../../shared/WallUrl';
import EditPopup from './EditPopup';


tinymce.PluginManager.add('wallsio', (editor) => {

  editor.addButton( 'wallsio_view_edit', {
    tooltip: 'Edit Wall',
    icon: 'dashicon dashicons-edit',
    onclick: onEditClick,
  });

  editor.addButton('wallsio_view_remove', {
    tooltip: 'Remove',
    icon: 'dashicon dashicons-no',
    onclick: () => editor.fire('cut'),
  });

  editor.on('init', () => {
    editor.on('Click', shimClickHandler, true);
    editor.on('DblClick', shimDblClickHandler);

    editor.on('wptoolbar', addToolbar, true);
  });

  function updateContent(node, values) {
    const url = wallUrlFromDetails(values);

    jQuery(node).data('rendered', false);

    editor.dom.setAttrib(node, 'data-wpview-text', encodeURIComponent(url));

    wp.mce.views.createInstance('embedURL', url, { url: true }, false).render();

    editor.selection.select(node);
    editor.nodeChanged();
    editor.focus();
  }

  function shimClickHandler(evt) {
    if (!isOurShim(evt.target)) {
      return;
    }

    // Prevent other code from disabling the shim
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
  }

  function shimDblClickHandler(evt) {
    if (!isOurShim(evt.target)) {
      return;
    }

    const wpView = jQuery(evt.target).closest(wpViewSelector()).get(0);

    if (!isOurWpView(wpView)) {
      return;
    }

    evt.preventDefault();

    openEditPopupForView(wpView);
  }

  function openEditPopupForView(wpView) {
    const values = getCurrentValues(wpView);

    const popup = new EditPopup();

    popup.open(values, (values) => {
      updateContent(wpView, values);
    });
  }

  function addToolbar(evt) {
    const element = evt.element;

    if (!isOurWpView(element)) {
      return;
    }

    // Don't add other (native) toolbars to our element
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();

    evt.toolbar = editor.wp._createToolbar([
      'wallsio_view_edit',
      'wallsio_view_remove',
    ]);
  }

  function onEditClick() {
    const node = editor.selection.getNode();

    if (!isOurWpView(node)) {
      return;
    }

    openEditPopupForView(node);
  }

  function getCurrentValues(wpView) {
    const urlValue = jQuery(wpView).attr('data-wpview-text');

    if (!urlValue || typeof urlValue !== 'string') {
      return {};
    }

    const url = decodeURIComponent(urlValue);

    return wallUrlToDetails(url);
  }

  /**
   * Whether the element is a shim for an oembed which is handled by us
   *
   * @param  {HTMLElement}  element
   * @return {Boolean}
   */
  function isOurShim(element) {
    const selector = iframeSelector() + '~ .mce-shim';

    return matches(element, selector);
  }

  /**
   * Whether an element matches the given selector
   *
   * Works just like element.matches(selector)
   *
   * @param  {HTMLElement} element
   * @param  {string} selector
   *
   * @return {Boolean}
   */
  function matches(element, selector) {
    return jQuery(element).filter(selector).length > 0;
  }

  /**
   * Selector for oembed iframes which are handled by us
   *
   * @return {string}
   */
  function iframeSelector() {
    return '.wpview iframe[src^="https://my.walls.io/"]';
  }

  function wpViewSelector() {
    return '.wpview';
  }

  function isOurWpView(element) {
    return matches(element, wpViewSelector()) && hasChild(element, iframeSelector());
  }

  function hasChild(element, childSelector) {
    return element.querySelector(childSelector) !== null;
  }
});
