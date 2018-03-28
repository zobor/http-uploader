function Uploader (opts){

    opts.progress = opts.progress || function () { };
    opts.success = opts.success || function () { };
    opts.error = opts.error || function () { };
    opts.enctype = opts.enctype || 'multipart/form-data'
    opts.callbackId = opts.callbackId || 'callback'
    this.opts = opts

    this.upload=function(opts) {
        opts = opts || {}
        this.opts = $.extend({}, this.opts, opts)
        this.start();
    }

    this.start = function() {
        var form = new FormData();

        for (var i in this.opts.data) {
            form.append(i, this.opts.data[i])
        }

        this.startTime = +new Date()
        var that = this
        var ajaxSetting = {
            url: that.opts.url,
            data: form,
            method: 'post',
            contentType: false,
            dataType: this.opts.dataType,
            processData: false,
            success: function(res) {
                that.endTime = +new Date()
                that.opts.success($.extend({
                    time: that.endTime - that.startTime,
                }, res || {}))
            },
            error: function(err) {
                that.endTime = +new Date()
                that.opts.error($.extend({
                    time: that.endTime - that.startTime,
                }, err || {}))
            },
            progress: function(evt) {
                var progress = parseInt(evt.loaded / evt.total * 100) + '%'
                that.opts.progress(progress)
            }
        }
        if (that.opts.timeout){
            ajaxSetting.timeout = that.opts.timeout;
        }
        $.ajax(ajaxSetting)
    }

    this.getPreviewImageURL = function(fileNode) {
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