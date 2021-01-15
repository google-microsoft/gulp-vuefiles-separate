var Stream = require('stream');
var Path = require('path');

//生成js代码
exports.pickScript = function (obj, options) {
    options = options || {};
    var stream = new Stream.Transform({objectMode: true});

    function parsePath(path) {
        var extname = options.multiExt
            ? Path.basename(path).slice(Path.basename(path).indexOf('.'))
            : Path.extname(path);
        return {
            dirname: Path.dirname(path),
            basename: Path.basename(path, extname),
            extname: extname
        };
    }

    stream._transform = function (originalFile, unused, callback) {
        var resultScript = originalFile.clone({contents: false});
        let codeText = String(resultScript.contents);
        var result = '';
        codeText.replace(/<script[\s\S]*?>([\s\S]+?)<\/script>/g, function (a, b, c) {
            result += b;
        });
        resultScript.contents = Buffer.from(result);
        var parsedPath = parsePath(resultScript.relative);
        var dirname = parsedPath.dirname;
        var prefix = obj.prefix || '';
        var suffix = obj.suffix || '';
        var basename = parsedPath.basename;
        var extname = obj.extname || parsedPath.extname;
        var path = Path.join(dirname, basename, prefix + basename + suffix + extname);
        resultScript.path = Path.join(resultScript.base, path);
        callback(null, resultScript);
    };

    return stream;
}

exports.scriptSrcLink = function (obj, options) {
    options = options || {};
    var stream = new Stream.Transform({objectMode: true});

    function parsePath(path) {
        var extname = options.multiExt
            ? Path.basename(path).slice(Path.basename(path).indexOf('.'))
            : Path.extname(path);
        return {
            dirname: Path.dirname(path),
            basename: Path.basename(path, extname),
            extname: extname
        };
    }

    stream._transform = function (originalFile, unused, callback) {
        var vueTemplate = originalFile.clone({contents: false});

        var parsedPath = parsePath(vueTemplate.relative);
        var dirname = parsedPath.dirname;
        var prefix = obj.prefix || '';
        var suffix = obj.suffix || '';
        var basename = parsedPath.basename;
        var extname = obj.extname || parsedPath.extname;
        var path = Path.join(dirname, basename, prefix + basename + suffix + extname);
        vueTemplate.path = Path.join(vueTemplate.base, path);

        let codeText = String(vueTemplate.contents);
        //1.清除掉js代码,并插入script的连接文件
        var result = codeText.replace(/<script[\s\S]*?>([\s\S]+?)<\/script>/g, `<script src="./${basename}.js"></script>`);
        //2. 把赋值的数据回写到vue文件中
        vueTemplate.contents = Buffer.from(result);

        callback(null, vueTemplate);
    };

    return stream;
}
