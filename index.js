path = require('path');
fs = require('fs');
jade = require('jade');

module.exports = function(opts) {

  if (!opts.baseDir)
    throw new Error('baseDir should be set');

  if (!opts.baseUrl)
    throw new Error('baseUrl should be set');

  opts.jade = opts.jade || {};


  return function(req, res, next) {
    var filepath, url;

    if (req.originalUrl.indexOf(opts.baseUrl) !== 0)
      return next();

    url = req.originalUrl.replace(/html$/, 'jade').replace(opts.baseUrl, '');
    filepath = path.join(opts.baseDir, url);

    if (filepath.indexOf(opts.baseDir) !== 0)
      return next(new Error('Invalid path'));


    fs.exists(filepath, function isExists(exists) {
      if (!exists)
        return next();

      jade.renderFile(filepath, opts.jade, function renderFile(err, html) {
        if (err)
          return next(err);

        res.setHeader('Content-Length', Buffer.byteLength(html));
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.end(html);
      });

    });
  };

};
