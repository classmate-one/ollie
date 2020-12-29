
const cos = new COS({
  SecretId: 'AKIDoCSYo2j4Qdszynlp6wbIEKG1d56Pt6fF',
  SecretKey: 'pegXDj4FF4k5ILG1c3TmcLuKaigWDSWW'
});
const imgBaseURL = 'https://files-1257979020.cos.ap-chengdu.myqcloud.com/';
const config = {
  Bucket: 'files-1257979020',
  Region: 'ap-chengdu',
};


cos.getBucket(config, (err, data)=> {
  if (err) {
    return;
  }
  const content = document.getElementById('container');
  data.Contents.forEach(item => {
    const child = renderImage(imgBaseURL + item.Key);
    content.appendChild(child);
  })
});

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

function renderImage(url) {
  const img = new Image();
  img.src = url;
  return img;
}
