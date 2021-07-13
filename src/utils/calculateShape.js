const calculateShape = (direction, e, props, border, store) => {
  const startX = e.clientX
  const startY = e.clientY
  const position = { ...props.defaultStyle }
  const startLeft = position.left
  const startTop = position.top
  const width = position.width
  const height = position.height

  const rect = border.value.getBoundingClientRect()
  const realTop = rect.top
  const realLeft = rect.left
  const offsetY = realTop - startTop
  const offsetX = realLeft - startLeft

  let hasMove = false

  const move = (moveEvent) => {
    hasMove = true
    const curX = moveEvent.clientX
    const curY = moveEvent.clientY
    const disLX = curX - offsetX - startLeft
    const disRX = disLX - width
    const disTY = curY - offsetY - startTop
    const disBY = disTY - height

    if (direction.includes('e')) {
      if (disLX <= 0) {
        position.width = 0
      } else {
        position.width = disLX
      }
    }

    if (direction.includes('w')) {
      if (disRX < 0) {
        position.width = width - disLX
        position.left = curX
      } else {
        position.width = 0
        position.left = startLeft + width
      }
    }

    if (direction.includes('n')) {
      if (disBY < 0) {
        position.height = height - disTY
        position.top = curY - offsetY
      } else {
        position.height = 0
        position.top = startTop + height
      }
    }

    if (direction.includes('s')) {
      if (disTY < 0) {
        position.height = 0
      } else {
        position.height = height + disBY
      }
    }
    store.commit('SET_POSITION', position)
  }

  const up = () => {
    hasMove && store.commit('RECORD')
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }

  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', up)
}

export default calculateShape