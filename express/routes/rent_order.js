import express from 'express'
import multer from 'multer'

import { v4 as uuidv4 } from 'uuid'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層
import { DATE, NUMBER } from 'sequelize'

const router = express.Router()
const upload = multer()

// GET - 取得單一用戶的所有優惠券（根據用戶 ID）
router.get('/user_coupon/:user_id', async function (req, res) {
  try {
    const userId = parseInt(req.params.user_id, 10)

    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user ID' })
    }

    let query = `
      SELECT uc.id AS user_coupon_id, uc.*, c.* FROM user_coupon uc
      JOIN coupon c ON uc.coupon_id = c.id
      WHERE uc.user_id = ? AND uc.status = '未使用'
    `
    const params = [userId]

    // 根據 received_at 降冪排序
    query += ' ORDER BY uc.received_at DESC'

    const [userCoupons] = await db.query(query, params)

    if (userCoupons.length === 0) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No coupons found for this user' })
    }

    return res.json({ status: 'success', data: { userCoupons } })
  } catch (error) {
    console.error('Error fetching user coupons:', error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// 於結帳時將訂單資料寫入
router.post('/:user_id', async (req, res) => {
  const userId = req.params.user_id

  const order = JSON.parse(req.body.order)
  const orderItems = JSON.parse(req.body.orderItems)

  console.log(order)
  console.log(orderItems)

  try {
    await db.query(
      `
    INSERT INTO p_shop_order (
     order_id,
      user_id,
      shop_id,
      start_time,
      end_time,
      amount,
      discount,
      create_datetime,
      payment,
      order_status,
      pickup_id,
      user_coupon_id,
      notes,
      status,
      order_info,
      created_at,
      updated_at
    ) VALUES (
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      ?,
      NOW(),
      NOW()
    )
    `,
      [
        order.order_id,
        order.user_id,
        order.shop_id,
        order.start_time,
        order.end_time,
        order.amount,
        order.discount,
        order.create_datetime,
        order.payment,
        order.order_status,
        order.pickup_id,
        order.user_coupon_id,
        order.notes,
        order.status,
        order.order_info,
      ]
    )

    // 插入訂單項目到 order_items 表
    for (const item of orderItems) {
      await db.query(
        `
        INSERT INTO price_relate_order (
          shop_order_id,
          price_id,
          count,
          created_at,
          updated_at
        ) VALUES (
          ?, ?, ?, NOW(), NOW()
        )
        `,
        [order.order_id, item.price_id, item.count]
      )
    }

    res.status(200).json({
      status: 'success',
      msg: '成功：獲取購物車列表內容。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢單一商品時，SQL查詢錯誤。',
    })
  }
})

// 原本用來更新狀態使用的
router.put('/:order_id', async (req, res) => {
  const orderId = req.params.order_id
  const status = req.body.status
  console.log(status, orderId)
  try {
    await db.query(
      `
      UPDATE 
      p_shop_order 
      SET 
      order_status = ? ,updated_at = NOW()
      WHERE 
      order_id = ? 
      `,
      [status, orderId]
    )
    res.status(200).json({
      status: 'success',
      msg: '成功：更新單一訂單狀態。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：更新單一訂單狀態時，SQL錯誤。',
    })
  }
})

export default router
