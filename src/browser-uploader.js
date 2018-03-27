class Uploader {

    constructor(opts) {
        opts.progress = opts.progress || function () { };
        opts.success = opts.success || function () { };
        opts.error = opts.error || function () { };
        opts.enctype = opts.enctype || 'multipart/form-data'
        opts.callbackId = opts.callbackId || 'callback'
        this.opts = opts
    }

    upload(opts = {}) {
        this.opts = this.extend({}, this.opts, opts)
        this.start();
    }

    extend() {
        var args = arguments;
        if (args.length <= 1) return;
        if (args.length === 2) {
            for (var key in args[1]) {
                args[0][key] = args[1][key];
            }
            return args[0];
        }
        var len = args.length - 1,
            i = len,
            fn = this.extend;
        for (; i > 0; i--) {
            args[i - 1] = fn(args[i - 1], args[i]);
        }
        return args[0];
    }

    newElm(tagName, className) {
        var a = document.createElement(tagName)
        if (className) {
            a.className = className
        }
        return a;
    }

    showTipsAndHide(){

    }

    uiUpdateProgress(){

    }

    start() {
        var form = new FormData();
        
        for (var i in this.opts.data) {
            form.append(i, this.opts.data[i])
        }

        this.startTime = +new Date()
        var ajaxSetting = {
            url: this.opts.url,
            data: form,
            method: 'post',
            contentType: false,
            dataType: this.opts.dataType,
            success: res => {
                this.endTime = +new Date()
                this.opts.success(this.extend({
                    time: this.endTime - this.startTime,
                }, res || {}))
            },
            error: err => {
                this.endTime = +new Date()
                this.opts.error(this.extend({
                    time: this.endTime - this.startTime,
                }, err || {}))
            },
            progress: evt => {
                var progress = parseInt(evt.loaded / evt.total * 100) + '%'
                this.uiUpdateProgress(progress)
                if (evt.loaded == evt.total) {
                    this.showTipsAndHide();
                }
                this.opts.progress(progress)
            }
        }
        if (this.opts.timeout){
            ajaxSetting.timeout = this.opts.timeout;
        } 
        this.ajax(ajaxSetting)
    }

    ajax(setting) {
        //设置参数的初始值
        var opts = {
            method: (setting.method || "GET").toUpperCase(),
            url: setting.url || "",
            async: setting.async || true,
            dataType: setting.dataType || "json",
            'Content-Type': setting.contentType || "application/x-www-form-urlencoded",
            data: setting.data || "",
            success: setting.success || function () { },
            error: setting.error || function () { },
            progress: setting.progress || function () { },
            timeout: setting.timeout
        }

        // 参数格式化
        function params_format(obj) {
            var str = ''
            for (var i in obj) {
                str += i + '=' + obj[i] + '&'
            }
            return str.split('').slice(0, -1).join('')
        }

        // 创建ajax对象
        var xhr = new XMLHttpRequest();
        var onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                switch (opts.dataType) {
                    case "json":
                        var json = JSON.parse(xhr.responseText);
                        opts.success(json);
                        break;
                    case "xml":
                        opts.success(xhr.responseXML);
                        break;
                    default:
                        opts.success(xhr.responseText);
                        break;
                }
            }
        }

        var onerror = function (err) {
            opts.error(err);
        }

        var onprogress = function (evt) {
            if (evt.total) {
                opts.progress(evt)
            }
        }

        xhr.addEventListener('progress', onprogress, false);
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', onprogress, false);
        }
        xhr.addEventListener('readystatechange', onreadystatechange, false);
        xhr.addEventListener('error', onerror, false);

        // 连接服务器open(方法GET/POST，请求地址， 异步传输)
        if (opts.method == 'GET') {
            xhr.open(opts.method, opts.url + "?" + params_format(opts.data), opts.async);
            xhr.send();
        } else {
            xhr.open(opts.method, opts.url, opts.async);
            if (!opts.data instanceof FormData) {
                xhr.setRequestHeader("Content-Type", opts['Content-Type']);
            }
            xhr.send(opts.data);
        }

        if (this.timer) clearTimeout(this.timer);
        if (opts.timeout) {
            this.timer = setTimeout(() => {
                xhr.abort()
                opts.error({ error: 'timeout' })
            }, opts.timeout)
        }
        
    }

    getPreviewImageURL(fileNode) {
        var url;
        var ie = !-[1,]
        if (ie) {
            return ''
        } else if (window.URL && window.URL.createObjectURL) {
            url = window.URL.createObjectURL(fileNode.files[0])
        }
        return url
    }
}

window.Uploader = Uploader