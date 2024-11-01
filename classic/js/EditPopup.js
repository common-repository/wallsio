/*global jQuery */

import popupTemplate from './popup.tpl';
import { randomInt } from './helpers.js';


export default class EditPopup {

  constructor($context) {
    this.$context = $context;
    this.$overlay = null;
    this.$popup = null;
  }

  open(values, onSubmit) {
    const defaultValues = {
      wallIdentifier: '',
      width: 'auto',
      height: null,
      defaultWidth: 560, // placeholder width
      defaultHeight: 800, // placeholder height
      showBackground: false,
      showHeader: false,
    };

    this.allValues = Object.assign({}, defaultValues, values);
    const templateValues = this.getTemplateValues(this.allValues);
    const popupHtml = popupTemplate(templateValues);

    this.$popup = jQuery(popupHtml);

    this.updateAutoWidth();

    this.insertIntoDom(this.$popup);

    this.addEventListeners(onSubmit);

    this.focus();
  }

  insertIntoDom() {
    const wrapper = this.getOrCreateWrapper();
    wrapper.prepend(this.$popup);
  }

  getOrCreateWrapper() {
    if (this.$context) {
      return this.$context;
    }

    if (this.$overlay) {
      return this.$overlay;
    }

    this.$overlay = this.createOverlay();
    jQuery(document.body).append(this.$overlay);

    return this.$overlay;
  }

  createOverlay() {
    return jQuery('<div>', {
      'class': 'wallsio-overlay media-modal-backdrop',
    });
  }

  getTemplateValues(values) {
    const isAutoWidth = values.width === 'auto' ? 1 : 0;

    // value="auto" is not valid HTML for <number> inputs
    const width = values.width === 'auto' ? '' : values.width;

    const popupIntId = randomInt();

    return Object.assign({}, values, { isAutoWidth, popupIntId, width });
  }

  addEventListeners(onSubmit) {
    this.$popup.on('click', '.wallsio-cancel', () => {
      this.close();
    });

    this.$popup.on('click', '.wallsio-insert', () => {
      this.handleSubmitIntent(onSubmit);
    });

    this.$popup.on('keydown', (evt) => {
      if (this.isEnterButton(evt)) {
        evt.preventDefault();
        this.handleSubmitIntent(onSubmit);
      }
    });

    this.$popup.on('keyup', (evt) => {
      if (this.isEscButton(evt)) {
        evt.preventDefault();
        this.close();
      }
    });

    if (this.$overlay) {
      this.$overlay.on('click', (evt) => {

        // Clicks on child elements (e.g. the popup) should not be handled
        if (this.isCurrentTarget(evt)) {
          evt.preventDefault();
          this.close();
        }
      });

      this.$overlay.on('keyup', (evt) => {
        if (this.isEscButton(evt)) {
          evt.preventDefault();
          this.close();
        }
      });
    }

    this.$popup.find('.wallsio-width-select').on('change', () => {
      this.updateAutoWidth();
    });
  }

  updateAutoWidth() {
    const width = this.getWidth();
    const isAutoWidth = width === 'auto';

    const autoWidthValue = isAutoWidth ? 1 : 0;
    this.$popup.attr('data-auto-width', autoWidthValue);
  }

  isCurrentTarget(evt) {
    return evt.target === evt.currentTarget;
  }

  close() {
    if (this.$popup) {
      this.$popup.remove();
      this.$popup = null;
    }

    if (this.$overlay) {
      this.$overlay.remove();
      this.$overlay = null;
    }
  }

  get isOpen() {
    return !!this.$popup;
  }

  isEscButton(evt) {
    return evt.key === 'Escape';
  }

  isEnterButton(evt) {
    return evt.key === 'Enter';
  }

  focus() {
    this.getFirstInput().focus();
  }

  getFirstInput() {
    return this.$popup.find('input').first();
  }

  getAllValues() {
    return {
      wallIdentifier: this.getInputValue('.wallsio-url-input'),
      width: this.getWidth(),
      height:  this.getHeight(),
      showHeader: this.getCheckboxValue('.wallsio-show-header-checkbox'),
      showBackground: this.getCheckboxValue('.wallsio-show-background-checkbox'),
    };
  }

  intVal(value) {
    return parseInt(value, 10) || null;
  }

  getWidth() {
    const widthType = this.getInputValue('.wallsio-width-select');

    if (widthType === 'auto') {
      return 'auto';
    }

    const strVal = this.getInputValue('.wallsio-fixed-width-input');
    return this.intVal(strVal) || this.allValues.defaultWidth;
  }

  getHeight() {
    const strVal = this.getInputValue('.wallsio-height-input');
    return this.intVal(strVal) || this.allValues.defaultHeight;
  }

  getInputValue(selector) {
    const value = this.$popup.find(selector).val();
    const strValue = value || '';
    return strValue.trim();
  }

  getCheckboxValue(selector) {
    return this.$popup.find(selector).is(':checked');
  }

  handleSubmitIntent(onSubmit) {
    const values = this.getAllValues();

    const wallIdentifier = values.wallIdentifier;

    if (!this.isValidWallIdentifier(wallIdentifier)) {
      alert('Please enter a valid wall URL');
      return;
    }

    onSubmit(values);

    this.close();
  }

  /**
   * Whether a string is actually a (BASE 10) integer value
   *
   * @param  {string}  value
   * @return {Boolean}
   */
  isIntString(value) {
    return parseInt(value, 10).toString() === value;
  }

  isValidWallIdentifier(wallIdentifier) {
    if (!wallIdentifier) {
      return false;
    }

    if (typeof wallIdentifier !== 'string') {
      return false;
    }

    if (this.isIntString(wallIdentifier)) {
      return true;
    }

    const minTitleUrlLength = 2;
    return wallIdentifier.length >= minTitleUrlLength;
  }
}
