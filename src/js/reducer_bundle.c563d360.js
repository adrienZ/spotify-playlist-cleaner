webpackJsonp([2],{8:function(module,exports,__webpack_require__){"use strict";eval("/* WEBPACK VAR INJECTION */(function(module) {\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n(function () {\n  var enterModule = __webpack_require__(0).enterModule;\n\n  enterModule && enterModule(module);\n})();\n\nvar _default = function _default() {\n  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};\n  var action = arguments[1];\n\n  switch (action.type) {\n    case 'USER_LOGIN':\n      return Object.assign({}, state, { user: action.user });\n    case 'USER_PLAYLIST_LISTING':\n      return Object.assign({}, state, { playlists: action.playlists });\n    case 'USER_PLAYLIST_FULL':\n      return Object.assign({}, state, { playlists_full: action.playlists_full });\n    default:\n      return state;\n  }\n};\n\n/* eslint-disable */\n\nexports.default = _default;\n;\n\n(function () {\n  var reactHotLoader = __webpack_require__(0).default;\n\n  var leaveModule = __webpack_require__(0).leaveModule;\n\n  if (!reactHotLoader) {\n    return;\n  }\n\n  reactHotLoader.register(_default, 'default', '/Users/adrienzaganelli/Documents/code/sptfy/app/src/js/reducer.js');\n  leaveModule(module);\n})();\n\n;\n/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)(module)))\n\n//////////////////\n// WEBPACK FOOTER\n// ./app/src/js/reducer.js\n// module id = 8\n// module chunks = 0 1 2\n\n//# sourceURL=webpack:///./app/src/js/reducer.js?")},89:function(module,exports,__webpack_require__){eval("module.exports = __webpack_require__(8);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi ./app/src/js/reducer.js\n// module id = 89\n// module chunks = 2\n\n//# sourceURL=webpack:///multi_./app/src/js/reducer.js?")}},[89]);