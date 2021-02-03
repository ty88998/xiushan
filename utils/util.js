/**
 * 格式化日期
 * @param {*} date 
 */
export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 数字补0
 * @param {*} n 
 */
export const formatNumber = n => {
  return n > 10 ? `${n}` : `0${n}`
}

/**
 * 传入数组，转换为瀑布流数据
 * @param {*} arr 已转换的瀑布流
 * @param {*} data 未转换的瀑布流
 */
export const dataToColumn = (arr, data) => {
  const len = arr.length
  const middle = Math.ceil(len / 2)
  const tmpA = arr.slice(0, middle)
  const tmpB = arr.slice(middle, len)
  for (let i = 0; i < data.length; i++) {
    if (i % 2 == 0) tmpA.push(data[i])
    else tmpB.push(data[i])
  }
  return [...tmpA, ...tmpB]
}

/**
 * 处理富文本里的图片宽度自适应
 * 1.去掉img标签里的style、width、height属性
 * 2.img标签添加style属性：max-width:100%;height:auto
 * 3.修改所有style里的width属性为max-width:100%
 * 4.去掉<br/>标签
 * @param html
 * @returns {void|string|*}
 */
export function formatRichText(html){
   let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
       match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
       match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
       match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
       return match;
   });
   newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
       match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
       return match;
   });
   newContent = newContent.replace(/<br[^>]*\/>/gi, '');
   newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;"');
   return newContent;
 }