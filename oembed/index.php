<?php

// Oembed providers

$provider = 'https://app.walls.io/oembed';

$source = 'wallsio_wordpress_plugin_v' . WALLSIO_PLUGIN_VERSION;
$home = get_home_url();

$provider = add_query_arg( 'source', $source, $provider );
$provider = add_query_arg( 'home', $home, $provider );

wp_oembed_add_provider( 'http://walls.io/*', $provider );
wp_oembed_add_provider( 'https://walls.io/*', $provider );
wp_oembed_add_provider( 'http://my.walls.io/*', $provider );
wp_oembed_add_provider( 'https://my.walls.io/*', $provider );
