/*global jQuery */

if (!global._babelPolyfill) {
  require('babel-polyfill');
}

import "../css/main.scss";

import EditPopup from './EditPopup';
import { fromDetails as wallurlFromDetails } from '../../shared/WallUrl';


(($) => {
  const insertContent = (content) => {
    wp.media.editor.insert(`<p>${content}</p>`);
  };

  const onSubmit = (submittedValues) => {
    const wallUrl = wallurlFromDetails(submittedValues);

    insertContent(wallUrl);
  };

  const getContext = (button) => {
    return $(button).closest('.wallsio-button-wrapper');
  };

  const isPopupOpen = ($context) => {
    const popup = $context.data('wallsioPopup');
    return popup && popup.isOpen;
  };

  const openPopup = ($context, values) => {
    if (!$context.data('wallsioPopup')) {
      $context.data('wallsioPopup', new EditPopup($context));
    }

    const popup = $context.data('wallsioPopup');

    popup.open(values, onSubmit);
  };

  const closePopup = ($context) => {
    const popup = $context.data('wallsioPopup');

    if (popup) {
      popup.close();
    }
  };

  const onMediaButtonClick = (button) => {
    const $context = getContext(button);

    if (isPopupOpen($context)) {
      closePopup($context);
      return;
    }

    const defaultWidth = $(button).data('default-width') || 560;
    const defaultHeight = $(button).data('default-height') || 800;

    const values = {
      defaultWidth: defaultWidth,
      defaultHeight: defaultHeight,
    };

    openPopup($context, values);
  };

  // init
  $('body').on('click', '.wallsio-add-wall-button', (evt) => {
    evt.preventDefault();
    onMediaButtonClick(evt.currentTarget);
  });

})(jQuery);
