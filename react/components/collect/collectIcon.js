import React, { useState } from 'react'
import styles from './collectIcon.module.css'
import { TbHeartMinus } from 'react-icons/tb'

const CollectIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [direction, setDirection] = useState('')

  const handleClick = (event) => {
    const btn = event.currentTarget
    const mx = event.clientX - btn.offsetLeft
    const my = event.clientY - btn.offsetTop

    const w = btn.offsetWidth
    const h = btn.offsetHeight

    const directions = [
      { id: 'top', x: w / 2, y: 0 },
      { id: 'right', x: w, y: h / 2 },
      { id: 'bottom', x: w / 2, y: h },
      { id: 'left', x: 0, y: h / 2 },
    ]

    directions.sort(
      (a, b) => distance(mx, my, a.x, a.y) - distance(mx, my, b.x, b.y)
    )

    setDirection(directions.shift().id)
    setIsOpen(true)
  }

  const handleYesClick = (e) => {
    e.stopPropagation() // 防止事件冒泡
    setIsOpen(false)
    setDirection('') // 重置方向
    // 這裡可以添加取消收藏的邏輯
  }

  const handleNoClick = (e) => {
    e.stopPropagation() // 防止事件冒泡
    setIsOpen(false)
    setDirection('') // 重置方向
  }

  const distance = (x1, y1, x2, y2) => {
    const dx = x1 - x2
    const dy = y1 - y2
    return Math.sqrt(dx * dx + dy * dy)
  }

  return (
    <>
      <div
        className={`${styles.btn} ${isOpen ? styles.btnOpen : ''}`}
        data-direction={direction}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick(e)
          }
        }}
        tabIndex={0} // 使元素可被鍵盤聚焦
        role="button" // 添加適當的角色
      >
        <button className={styles.btnFront}>
          <TbHeartMinus className={styles.CardIcon} />
        </button>
        <div className={styles.btnBack}>
          <p>確定取消這個收藏？</p>
          <button className={styles.yes} onClick={handleYesClick}>
            取消
          </button>
          <button className={styles.no} onClick={handleNoClick}>
            確定
          </button>
        </div>
      </div>
    </>
  )
}

export default CollectIcon
