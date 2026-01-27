/***************************************************************************************************
 * POLYFILLS FOR MODERN ANGULAR + WEBPACK 5
 ***************************************************************************************************/

/** CORE JS POLYFILLS (modern browsers, core-js@3) */
import 'core-js/es/array';
import 'core-js/es/object';
import 'core-js/es/function';
import 'core-js/es/string';
import 'core-js/es/number';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/symbol';
import 'core-js/es/reflect';

/** WEB ANIMATIONS (for Angular animations in some browsers) */
import 'web-animations-js';

/***************************************************************************************************
 * ZONE JS POLYFILL (required by Angular)
 ***************************************************************************************************/
/** Use the main entry defined in package.json exports */
import 'zone.js';  // <- THIS IS THE CORRECT IMPORT NOW

/***************************************************************************************************
 * APPLICATION IMPORTS
 ***************************************************************************************************/
// Add any custom polyfills here
