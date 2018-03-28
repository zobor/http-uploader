function getDropFileCallBack(dropFiles) {
  console.log(dropFiles, dropFiles.length);
}

var $dropZone = $("#dropZone");
var uploader = new Uploader({});
var $progress = $('#progress');
var $loading = $('#loading');


$('#select-btn').click(function(){
  $('#up-files').click();
})

$('#up-files').on('change',function(){
  handlerFiles([].slice.call(this.files,0))
})

function updateLoading(per){
  $progress.html(per);
  $('.cg-wrap').each(function(i,v){
    var curPer = $(this).find('.mask span').text();
    updatePrograss(this, curPer);
  });
}
function showLoading(){
  $loading.show();
}
function hideLoading(){
  $loading.hide();
}

function updatePrograss(el, persent){
    var persent = +persent;
    var deg = persent*360/100;
    if(deg>180){
        //左右半圆均需旋转
        $(el).find('.circle-left').css('transform', 'rotate('+(deg-180)+'deg)');
        $(el).find('.circle-right').css('transform', 'rotate(180deg)');
    }else{
        //右半圆旋转
        $(el).find('.circle-left').css('transform', 'rotate(0deg)');
        $(el).find('.circle-right').css('transform', 'rotate('+deg+'deg)');
    }
    //文本
    $(el).find('.mask span').text(persent);
}

function handlerFiles(fs) {
  if (!(fs && fs.length)) return;
  var data = {}
  fs.forEach(function(item,idx){
    data['file'+(idx+1)] = item
  })
  showLoading();
  uploader.upload({
      url: '/',
      data: data,
      progress:function(e){
        console.log(e)
        if (e&&e.replace) {
          updateLoading( e.replace('%','') )
        }
      },
      success: function(){
        hideLoading();
      }
  })
}

$dropZone.on("dragenter", function (e) {
  e = e.originalEvent;
  e.preventDefault();
  e.stopPropagation();
}).on("dragover", function (e) {
  e = e.originalEvent;
  e.preventDefault();
  e.stopPropagation();
}).on("dragleave", function (e) {
  e = e.originalEvent;
  e.preventDefault();
  e.stopPropagation();
}).on("drop", function (e) {
  e = e.originalEvent;
  e.preventDefault();
  e.stopPropagation();

  var df = e.dataTransfer;
  var dropFiles = [];
  var dealFileCnt = 0;
  var allFileLen = df.files.length;


  if (df.items !== undefined) {
    for (var i = 0; i < df.items.length; i++) {
      var item = df.items[i];
      if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
        var file = item.getAsFile();
        dropFiles.push(file);
      }
    }
    handlerFiles(dropFiles)
  }
});