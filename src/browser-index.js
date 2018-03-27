// 获得拖拽文件的回调函数
function getDropFileCallBack(dropFiles) {
  console.log(dropFiles, dropFiles.length);
}

var dropZone = document.querySelector("#dropZone");
var uploader = new Uploader({});

function handlerFiles(fs) {
  if (!(fs && fs.length)) return;
  var data = {}
  fs.forEach(function(item,idx){
    data['file'+(idx+1)] = item
  })
  uploader.upload({
      url: '/',
      data: data
  })
}

dropZone.addEventListener("dragenter", function (e) {
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("dragover", function (e) {
  e.dataTransfer.dropEffect = 'copy';
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("dragleave", function (e) {
  e.preventDefault();
  e.stopPropagation();
}, false);

dropZone.addEventListener("drop", function (e) {
  e.preventDefault();
  e.stopPropagation();


  var df = e.dataTransfer;
  var dropFiles = []; // 拖拽的文件，会放到这里
  var dealFileCnt = 0; // 读取文件是个异步的过程，需要记录处理了多少个文件了
  var allFileLen = df.files.length; // 所有的文件的数量，给非Chrome浏览器使用的变量

  // 检测是否已经把所有的文件都遍历过了
  function checkDropFinish() {
    if (dealFileCnt === allFileLen - 1) {
      getDropFileCallBack(dropFiles);
    }
    dealFileCnt++;
  }

  if (df.items !== undefined) {
    // Chrome拖拽文件逻辑
    for (var i = 0; i < df.items.length; i++) {
      var item = df.items[i];
      if (item.kind === "file" && item.webkitGetAsEntry().isFile) {
        var file = item.getAsFile();
        dropFiles.push(file);
      }
    }
    handlerFiles(dropFiles)
  }
}, false);