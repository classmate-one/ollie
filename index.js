
const cos = new COS({
  SecretId: 'AKIDoCSYo2j4Qdszynlp6wbIEKG1d56Pt6fF',
  SecretKey: 'pegXDj4FF4k5ILG1c3TmcLuKaigWDSWW'
});
const imgBaseURL = 'https://files-1257979020.cos.ap-chengdu.myqcloud.com/';

cos.getBucket({
  Bucket: 'files-1257979020', /* 必须 */
  Region: 'ap-chengdu',     /* 存储桶所在地域，必须字段 */
}, (err, data) => {
  if(err) {
    return;
  }
  const content = document.getElementById('container');
  data.Contents.forEach(item => {
    const child = renderImage(imgBaseURL + item.Key);
    content.appendChild(child);
  })
});

function renderImage(url) {
  const img = new Image();
  img.src = url;
  return img;
}
