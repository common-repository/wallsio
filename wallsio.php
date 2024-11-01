<?php

/*
Plugin Name: Walls.io: Social Media Feed
Plugin URI: https://wordpress.org/plugins/wallsio
Description: Embed Walls.io social walls into WordPress posts with just one click!
Version: 3.0.14
Author: Walls.io
Author URI: https://walls.io
License: GPL-3.0-or-later
License URI: https://www.gnu.org/licenses/gpl.txt
*/


define( 'WALLSIO_PLUGIN_VERSION', '3.0.14' );

function wallsio_asset_version() {
  return WP_DEBUG ? time() : WALLSIO_PLUGIN_VERSION;
}

require_once(plugin_dir_path(__FILE__) . 'oembed/index.php');
require_once(plugin_dir_path(__FILE__) . 'classic/php/index.php');
require_once(plugin_dir_path(__FILE__) . 'block/src/init.php');
