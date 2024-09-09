import { useState, useEffect } from 'react'
import styles from './ground-card.module.scss'
import Image from 'next/image'

export default function GroundCard({ onSelect, selected, orders }) {
  // 取資料
  // const [grounds, setGrounds] = useState([])

  // const getGrounds = async () => {
  //   try {
  //     const baseURL = 'http://localhost:3005/api/campground'
  //     const res = await fetch(baseURL)
  //     if (!res.ok) {
  //       throw new Error('Network response was not ok')
  //     }
  //     const { data } = await res.json()

  //     setGrounds(data.campgrounds)
  //   } catch (error) {
  //     console.error('Failed to fetch grounds:', error)
  //   }
  // }
  // useEffect(() => {
  //   getGrounds()
  // }, [])

  // -------------------------------------------------------------------------

  // const [orders, setOrders] = useState([])

  // // 取ground-order資料
  // const getOrders = async () => {
  //   try {
  //     const baseURL = `http://localhost:3005/api/group-ground-order/user/${user[0].id}`
  //     const res = await fetch(baseURL)
  //     if (!res.ok) {
  //       throw new Error('Network response was not ok')
  //     }
  //     const { data } = await res.json()
  //     console.log(data.ordersWithGround)

  //     const now = new Date() // 當前時間
  //     const validOrders = data.ordersWithGround.filter((order) => {
  //       const checkInDate = new Date(order.check_in_date)
  //       return checkInDate > now // 過濾掉過去的訂單
  //     })

  //     setOrders(validOrders) // 設置過濾後的訂單
  //   } catch (error) {
  //     console.error('Failed to fetch grounds:', error)
  //   }
  // }
  // useEffect(() => {
  //   getOrders()
  // }, [user])

  // -------------------------------------------------------------------------

  const handleSelect = (groundInfo) => {
    if (selected && selected.ground_name === groundInfo.ground_name) {
      onSelect(null) // 如果已選中，則取消選中
    } else {
      onSelect(groundInfo) // 否則選中
    }
  }

  // -------------------------------------------------------------------------

  // return grounds.map((ground, index) => {
  //   const groundOrderInfo = {
  //     max_member: 6, // 這裡的人數應根據實際需求設置
  //     start_date: '2024/10/13', // 這裡的日期應根據實際需求設置
  //     end_date: '2024/10/16',
  //     ground_id: ground.id,
  //     ground_name: ground.campground_name,
  //     ground_phone: ground.phone,
  //     ground_city: ground.city,
  //     address: ground.address,
  //     ground_altitude: ground.altitude,
  //     ground_geolocation: ground.geolocation,
  //   }

  return orders.map((order, index) => {
    const groundOrderInfo = {
      max_member: order.people,
      start_date: order.check_in_date,
      end_date: order.check_out_date,
      ground_id: order.campground.id,
      ground_name: order.campground.campground_name,
      ground_phone: order.campground.phone,
      ground_city: order.campground.city,
      address: order.campground.address,
      ground_altitude: order.campground.altitude,
      ground_geolocation: order.campground.geolocation,
      order_number: order.order_number,
      ground_img: order.campground.title_img_path,
    }

    const isSelected = selected?.ground_name === groundOrderInfo.ground_name

    // -------------------------------------------------------------------------

    return (
      <div
        key={index}
        className={`${styles.cardGround} ${styles.globe} ${
          isSelected ? styles.selected : ''
        }`}
        onClick={() => handleSelect(groundOrderInfo)}
      >
        <label className={styles.cardLabel}>
          <Image
            className={styles.cardImage}
            src={order.campground.title_img_path}
            alt={`Group Camping - ${groundOrderInfo.ground_name}`}
            width={200}
            height={0}
            layout="intrinsic"
            objectFit="cover"
          />
          <div className={styles.cardContent}>
            <p className={styles.h6Tc}>{groundOrderInfo.ground_name}</p>
            <p className={styles.p1En}>
              {groundOrderInfo.start_date} - {groundOrderInfo.end_date}
            </p>
            <p className={styles.p2Tc}>
              <span className={styles.h6En}>{groundOrderInfo.max_member}</span>{' '}
              人帳
            </p>
          </div>
          <span
            className={`${styles.customCheckbox} ${
              isSelected ? styles.checkedCheckbox : ''
            }`}
          >
            {isSelected ? '✔' : ''}
          </span>
        </label>
      </div>
    )
  })
}
