<div class="wallsio-popup-wrapper" data-auto-width='<%- isAutoWidth %>'>
  <div class="wallsio-popup">

    <div class="wallsio-popup-content">

      <div class="wallsio-input-section">
        <label class="wallsio-input-label" for="wallsio-wallidentifier-input-<%- popupIntId %>">
          Wall URL
        </label>
        <div class="wallsio-input-group-left">
          <label for="wallsio-wallidentifier-input-<%- popupIntId %>" class="wallsio-input-group-addon-left">my.walls.io /</label>

          <input
                  type="text"
                  class="wallsio-input wallsio-input-right wallsio-url-input"
                  id="wallsio-wallidentifier-input-<%- popupIntId %>"
                  value="<%- wallIdentifier %>"
          >
        </div>
      </div>

      <div class="wallsio-input-section">
        <label class="wallsio-input-label" for="wallsio-width-select-<%- popupIntId %>">Width</label>

        <div class="wallsio-multiple-inputs">
          <select
                  class="wallsio-select wallsio-first-input wallsio-width-select"
                  id="wallsio-width-select-<%- popupIntId %>"
          >
            <option value="auto" <%- isAutoWidth ? 'selected' : '' %> >Full width (responsive)</option>
            <option value="fixed"<%- !isAutoWidth ? 'selected' : '' %> >Fixed width</option>
          </select>

          <div class="wallsio-input-group-right wallsio-second-input wallsio-fixed-width-input-group">
            <input
                    type="number"
                    class="wallsio-input wallsio-input-left wallsio-fixed-width-input"
                    id="wallsio-width-input-<%- popupIntId %>"
                    min="0"
                    max="9999"
                    value="<%- width %>"
                    placeholder="<%- defaultWidth %>"
            >
            <label for="wallsio-width-input-<%- popupIntId %>" class="wallsio-input-group-addon-right">px</label>
          </div>
        </div>
      </div>

      <div class="wallsio-input-section">
        <label class="wallsio-input-label" for="wallsio-height-input-<%- popupIntId %>">Height</label>

        <div class="wallsio-input-group-right">
          <input
                  type="number"
                  class="wallsio-input wallsio-input-left wallsio-height-input"
                  id="wallsio-height-input-<%- popupIntId %>"
                  min="0"
                  max="9999"
                  value="<%- height %>"
                  placeholder="<%- defaultHeight %>"
          >
          <label for="wallsio-height-input-<%- popupIntId %>" class="wallsio-input-group-addon-right">px</label>
        </div>
      </div>

      <div class="wallsio-input-section wallsio-checkbox-input-section">
        <label class="wallsio-input-label wallsio-checkbox-label" for="wallsio-show-header-checkbox-<%- popupIntId %>">
          <input
                  type="checkbox"
                  id="wallsio-show-header-checkbox-<%- popupIntId %>"
                  name="wallsio-show-header-checkbox"
                  class="wallsio-show-header-checkbox"
          <%- showHeader ? 'checked' : '' %>
          >
          <span class="wallsio-checkbox-caption">
          <span class="wallsio-checkbox-caption-headline">Show wall header</span>
          <span class="wallsio-checkbox-caption-help">Display a header bar at the top of the wall</span>
        </span>
        </label>
      </div>

      <div class="wallsio-input-section wallsio-checkbox-input-section">
        <label class="wallsio-input-label wallsio-checkbox-label" for="wallsio-show-background-checkbox-<%- popupIntId %>">
          <input
                  type="checkbox"
                  id="wallsio-show-background-checkbox-<%- popupIntId %>"
                  name="wallsio-show-background-checkbox"
                  class="wallsio-show-background-checkbox"
          <%- showBackground ? 'checked' : '' %>
          >
          <span class="wallsio-checkbox-caption">
          <span class="wallsio-checkbox-caption-headline">Show wall background</span>
          <span class="wallsio-checkbox-caption-help">Display the wall background color and image</span>
        </span>
        </label>
      </div>

    </div>
    <div class="wallsio-button-bar">
      <span class="wallsio-cancel">Cancel</span>
      <button type="button" class="wallsio-insert button button-primary button-large">Insert into post</button>
    </div>
  </div>
</div>
