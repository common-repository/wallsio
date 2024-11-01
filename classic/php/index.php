<?php

// Actions

wallsio_register_actions();

function wallsio_register_actions() {
  add_action( 'media_buttons', 'wallsio_add_media_button');

  add_action( 'wp_enqueue_media', 'wallsio_add_script' );
  add_action( 'wp_enqueue_media', 'wallsio_add_style' );
  add_action( 'wp_enqueue_media', 'wallsio_add_editor_style' );

  add_filter( 'mce_external_plugins', 'wallsio_add_tinymce_plugin' );
}


// Functions

function wallsio_add_media_button($editor_id) {
  $icon = '<span class="wallsio-media-button-icon"></span>';

  $caption = "$icon Add a Walls.io Wall";

  $class_names = 'class="button wallsio-add-wall-button"';
  $data_editor = sprintf( 'data-editor="%s"', esc_attr( $editor_id ) );
  $data_default_width = sprintf( 'data-default-width="%s"', esc_attr( wallsio_get_default_width() ) );
  $data_default_height = sprintf( 'data-default-height="%s"', esc_attr( wallsio_get_default_height() ) );

  $tags = array(
    $class_names,
    $data_editor,
    $data_default_width,
    $data_default_height,
  );

  $tagsStr = implode(" ", $tags);

  echo '<span class="wallsio-button-wrapper">';
  echo "<button type=\"button\" $tagsStr>$caption</button>";
  echo '<div class="popup-wrapper"></div>';
  echo '</span>';
}

function wallsio_add_script() {
  $dependencies = array(
    'jquery',
  );
  $url = plugins_url( '../dist/main.js', __FILE__ );
  $version = wallsio_asset_version();
  wp_enqueue_script( 'wallsio_script', $url, $dependencies, $version, true );
}

function wallsio_add_style() {
  $url = plugins_url( '../dist/main.css', __FILE__ );
  $version = wallsio_asset_version();
  wp_enqueue_style( 'wallsio_style', $url, array(), $version, $media = 'all' );
}

function wallsio_add_editor_style() {
  $url = plugins_url( '../dist/tinymce.css', __FILE__ );
  $version = wallsio_asset_version();
  $urlWithVersion = add_query_arg( 'ver', $version, $url );
  add_editor_style( $urlWithVersion );
}

function wallsio_add_tinymce_plugin( $plugins ) {
  $url = plugins_url( '../dist/tinymce.js' , __FILE__ );
  $version = wallsio_asset_version();
  $urlWithVersion = add_query_arg( 'ver', $version, $url );

  $plugins['wallsio'] = $urlWithVersion;
  return $plugins;
}

function wallsio_get_default_width() {
  $defaults = wp_embed_defaults();
  return $defaults['width'];
}

function wallsio_get_default_height() {
  $defaults = wp_embed_defaults();
  return $defaults['height'];
}
