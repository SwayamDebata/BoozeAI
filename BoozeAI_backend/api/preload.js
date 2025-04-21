const { JSDOM } = require("jsdom");
const fetch = require("node-fetch"); // You'll need to install this
const WebSocket = require("ws"); // You'll need to install this
const XMLHttpRequest = require("xhr2"); // You'll need to install this
// Create JSDOM with a valid URL origin
const dom = new JSDOM("<!DOCTYPE html>", {
  url: "http://localhost",
  referrer: "http://localhost",
  contentType: "text/html",
  includeNodeLocations: false,
  storageQuota: 10000000,
});
// Set up global browser objects
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;
global.HTMLElement = dom.window.HTMLElement;
global.localStorage = dom.window.localStorage;
// Set up network-related APIs
global.fetch = fetch;
global.WebSocket = WebSocket;
global.XMLHttpRequest = XMLHttpRequest;
// Make sure window also has these APIs
global.window.fetch = fetch;
global.window.WebSocket = WebSocket;
global.window.XMLHttpRequest = XMLHttpRequest;
// Mock matchMedia
global.window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => true,
});
// Base64 encoding/decoding functions
global.atob = (str) => Buffer.from(str, "base64").toString("binary");
global.btoa = (str) => Buffer.from(str, "binary").toString("base64");
// Add console polyfill to window
global.window.console = global.console;
// Disable SSL verification for development (remove in production)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";