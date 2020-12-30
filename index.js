
const cos = new COS({
  SecretId: 'AKIDoCSYo2j4Qdszynlp6wbIEKG1d56Pt6fF',
  SecretKey: 'pegXDj4FF4k5ILG1c3TmcLuKaigWDSWW'
});
const imgBaseURL = 'https://files-1257979020.cos.ap-chengdu.myqcloud.com/';
const config = {
  Bucket: 'files-1257979020',
  Region: 'ap-chengdu',
};

document.addEventListener('click', () => {
  document.getElementById('menuID')?.remove();
})

document.body.onload = () => {
  getCOSBucket();
}

function handleChange(data) {
  const load = renderLoading();
  document.body.appendChild(load);
  getFiles(data.files).forEach((file, index, arr) => {
    const key = file.name;
    if(!['image/jpeg', 'image/png', 'video/mp4', 'image/gif'].includes(file.type)) {
      return;
    }
    putCOSObject({
      key,
      body: file,
      onProgress: e => {
        load.innerHTML = '已上传' + parseInt(e.percent * 100 * index / arr.length) + '%';
      },
      onSuccess: () => {
        load.remove();
        document.getElementById('content').appendChild(renderImage(imgBaseURL + key));
      },
      onError: () => { },
    });
  });
}

function handleDelete(url) {
  const load = renderLoading();
  document.body.appendChild(load);
  deleteCOSObject({
    key: url.slice(imgBaseURL.length - 1),
    onSuccess: () => {
      document.querySelectorAll('img').forEach(img => {        
        img.src === encodeURI(url) && img.parentElement.remove();
      });
      load.remove();
    },
    onError: err => console.log(err)
  });
}

function getCOSBucket() {
  const load = renderLoading();
  document.body.appendChild(load);
  cos.getBucket(config, (err, data) => {
    if (err) {
      return;
    }
    const content = document.getElementById('content');
    data.Contents.forEach(item => {
      const child = renderImage(imgBaseURL + item.Key);
      content.appendChild(child);
    })
    load.remove();
  });
}

function putCOSObject({
  key: Key,
  body: Body,
  onProgress,
  onSuccess,
  onError,
}) {
  cos.putObject({
    ...config,
    Key,              /* 必须 */
    StorageClass: 'STANDARD',
    Body, // 上传文件对象
    onProgress,
  }, function (err, data) {
    err ? onError(err) : onSuccess(data);
  });
}

function deleteCOSObject({
  key: Key,
  onError,
  onSuccess,
}) {
  cos.deleteObject({
    ...config,
    Key
  }, (err, data) => {
    err ? onError(err) : onSuccess(data);
  });
}

function renderImage(url) {
  const div = document.createElement('div');
  const p = document.createElement('p');
  p.innerHTML = url.slice(url.lastIndexOf('/') + 1);
  const img = new Image();
  img.src = url;
  img.style.backgroundColor = `rgba(${random(100, 200)}, ${random(100, 200)}, ${random(100, 200)}, .8)`;
  div.oncontextmenu = e => {
    e.preventDefault();
    document.getElementById('menuID')?.remove();
    document.body.appendChild(renderMenu(url, e.pageX, e.pageY));
  }
  div.appendChild(img);
  div.appendChild(p);
  return div;
}

function renderMenu(url, x, y) {
  const menuDOM = document.createElement('div');
  menuDOM.id = 'menuID';
  menuDOM.setAttribute('class', 'container-menu');
  menuDOM.setAttribute('style', `left: ${x}px;top: ${y}px`);
  menuDOM.oncontextmenu = e => e.preventDefault();
  const deleteBtn = document.createElement('span');
  deleteBtn.innerHTML = '删除';
  deleteBtn.onclick = () => {
    menuDOM.remove();
    handleDelete(url)
  };
  menuDOM.appendChild(deleteBtn);
  return menuDOM;
}

function renderLoading() {
  const loadDOM = document.createElement('div');
  loadDOM.innerHTML = '加载中...'
  loadDOM.setAttribute('class', 'container-loading');
  setTimeout(() => {
    loadDOM.remove();
  }, 20000);
  return loadDOM;
}

function getFiles(files) {
  return [...new Array(files.length)].map((v, i) => files.item(i));
}

function random(min, max) {
  return parseInt(Math.random() * max + min);
}
