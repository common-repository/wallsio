
import { defaultDetails } from "../block/src/config";
import {
  boolToInt,
  isObject,
} from "./util";

/**
 * Create wall URL from the given wall details
 *
 * @param {object} details
 * @return {string|null}
 */
export function fromDetails(details) {
  if (!isObject(details)) {
    return null;
  }

  const { wallIdentifier } = details;

  if (!wallIdentifier) {
    return null;
  }

  const params = detailsToSearchParams(details);
  const searchStr = "?" + params.join("&");

  return "https://my.walls.io/" + wallIdentifier + searchStr;
}

function detailsToSearchParams(details) {
  const searchParams = [];

  if (details.hasOwnProperty("showHeader")) {
    const showHeader = "show_header=" + boolToInt(details.showHeader);
    searchParams.push(showHeader);
  }

  if (details.hasOwnProperty("showBackground")) {
    const showBackground = "nobackground=" + boolToInt(!details.showBackground);
    searchParams.push(showBackground);
  }

  if (details.width) {
    // Works for both px values (e.g. `500`) and `auto`
    const width = "embedwidth=" + details.width;
    searchParams.push(width);
  } else {
    const width = "embedwidth=auto";
    searchParams.push(width);
  }

  if (details.hasOwnProperty("height")) {
    // Works for both px values (e.g. `500`) and `auto`
    const height = "embedheight=" + details.height;
    searchParams.push(height);
  }

  return searchParams;
}

/**
 * Create wall details from the given Wall URL
 *
 * @param url
 * @return {object}
 */
export function toDetails(url) {
  const values = parseUrl(url);

  if (!isValidHost(values.host)) {
    return {};
  }

  const details = {};

  details.wallIdentifier = getWall(values.pathname);
  if (!details.wallIdentifier) {
    return {};
  }

  const wallParams = parseSearch(values.search);

  if (wallParams.hasOwnProperty("embedheight")) {
    details.height = wallParams.embedheight;
  }

  if (wallParams.hasOwnProperty("embedwidth")) {
    details.width = wallParams.embedwidth;
  }

  if (wallParams.hasOwnProperty("show_header")) {
    details.showHeader = wallParams.show_header === "1";
  }

  if (wallParams.hasOwnProperty("nobackground")) {
    details.showBackground = wallParams.nobackground !== "1";
  }

  return details;
}

function parseUrl(url) {
  const link = document.createElement("a");
  link.href = url;

  const keys = [
    "host",
    "hostname",
    "hash",
    "href",
    "pathname",
    "port",
    "protocol",
    "search",
  ];

  const values = {};
  for (const key of keys) {
    values[key] = getValueFromLink(link, key);
  }

  const pathname = values.pathname.replace(/^[/]?/, "/");

  if (!pathname.startsWith("/")) {
    values.pathname = "/" + pathname;
  }

  return values;
}

function getValueFromLink(link, key) {
  if (key === "host") {
    return link.host.replace(/(:443)|(:80)$/, ""); // remove default ports
  }

  if (key === "pathname") {
    return link.pathname.replace(/^[/]?/, "/"); // Always add trailing "/"
  }

  return link[key];
}

function parseSearch(search) {
  const searchStr = search || "";

  const match = searchStr.match(/[?](.+)/);

  if (!match) {
    return {};
  }

  const rest = match[1];
  const parts = rest.split("&");

  const values = {};

  for (const part of parts) {
    const [key, value] = part.split("=");
    values[key] = value === undefined ? null : value;
  }

  return values;
}

function isValidHost(host) {
  return host === "walls.io" || host === "my.walls.io";
}

function getWall(urlPath) {
  urlPath = urlPath.replace(/\/$/, "");

  const match = urlPath.match(/^\/([\w-]{2,})$/i);

  if (!match) {
    return null;
  }

  return match[1];
}

/**
 * Create a wall URL with default search params
 *
 * All previous search params are removed and default params are added.
 *
 * @param {string} wallUrl
 * @return {string|null}
 */
export function toWallBaseUrl(wallUrl) {
  const { wallIdentifier } = toDetails(wallUrl);
  return fromDetails({ wallIdentifier });
}

/**
 * Create a wall URL from a wall identifier
 *
 * @param {string} wallIdentifier
 * @return {string|null}
 */
export function initialWallUrl(wallIdentifier) {
  return initialWallUrlWithDetails(wallIdentifier, defaultDetails);
}

/**
 * Create a wall URL from a wall identifier and some details
 *
 * @param {string} wallIdentifier
 * @param {object} details
 * @return {string}
 */
export function initialWallUrlWithDetails(wallIdentifier, details) {
  details.wallIdentifier = wallIdentifier;
  return fromDetails(details);
}
