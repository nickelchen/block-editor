'use strict';
var Logger = require('./Logger');

var elemIdCounter = 0;

function nextArticleElemId (articleId) {
    elemIdCounter++;
    var elemId = 'article_' + articleId + '_elems_' + elemIdCounter;
    Logger.verbose('elemId', elemId);
    return elemId;
}

function getFunName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function getHostName(str) {
  var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
  var m = str.match(re);
  if (!m) {
    return str;
  }
  return m[1].toString();
}

function getHostNameWithSchema(str) {
  var re = new RegExp('(.*)?\://([^/]+)', 'im');
  var m = str.match(re);
  if (!m) {
    return str;
  }
  return m[1].toString() + '://' + m[2].toString();
}


var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

var tagOrComment = new RegExp(
    '<(?:'
    // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
    // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
    // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
function removeTags(html) {
  var oldHtml;
  do {
    oldHtml = html;
    html = html.replace(tagOrComment, '');
  } while (html !== oldHtml);
  return html.replace(/</g, '&lt;');
}


module.exports = {
    nextArticleElemId: nextArticleElemId,

    getFunName: getFunName,
    getHostName: getHostName,
    removeTags: removeTags,
};

