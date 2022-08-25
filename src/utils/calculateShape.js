import { calculateRotatedPointCoordinate, getCenterPoint } from './translate'

export default function calculateShape(name, style, curPositon, symmetricPoint) {
  // 通过对角线获取新中心
  const newCenterPoint = getCenterPoint(curPositon, symmetricPoint)
  // 当前鼠标位置转化为 rotated 之前的位置
  const rotatedCurPostion = calculateRotatedPointCoordinate(curPositon, newCenterPoint, -style.rotate)
  // 对称点位置转化为 rotated 之前的位置
  const rotatedSymmetricPoint = calculateRotatedPointCoordinate(symmetricPoint, newCenterPoint, -style.rotate)

  const { minWidth, minHeight } = style

  if (name.length === 2) {
    // 如果是选中了四个角上的点那么意味着宽高都会改变
    const newWidth = name.includes('e') ? rotatedCurPostion.x - rotatedSymmetricPoint.x : rotatedSymmetricPoint.x - rotatedCurPostion.x
    const newHeight = name.includes('s') ?  rotatedCurPostion.y - rotatedSymmetricPoint.y : rotatedSymmetricPoint.y - rotatedCurPostion.y
    
    if (newWidth >= minWidth && newHeight >= minHeight) {
      style.width = Math.round(newWidth)
      style.height = Math.round(newHeight)
      style.left = Math.min(rotatedCurPostion.x, rotatedSymmetricPoint.x)
      style.top = Math.min(rotatedCurPostion.y, rotatedSymmetricPoint.y)
    }
  } else {
    // 选中四边的中点时，意味着长和宽只改变一项
    // 根据当前位置和对称点位置可以得出长或宽
    const distanceX = name === 'e' ? rotatedCurPostion.x - rotatedSymmetricPoint.x : rotatedSymmetricPoint.x - rotatedCurPostion.x
    const distanceY = name === 's' ? rotatedCurPostion.y - rotatedSymmetricPoint.y : rotatedSymmetricPoint.y - rotatedCurPostion.y

    if (distanceY >= minHeight && ['n', 's'].includes(name)) {
      style.height = distanceY
      if (name === 'n') {
        style.top = newCenterPoint.y - distanceY / 2
      }
    }

    if (distanceX >= minWidth && ['w', 'e'].includes(name)) {
      style.width = distanceX
      if (name === 'w') {
        style.left = newCenterPoint.x - distanceX / 2
      }
    }
  }
}