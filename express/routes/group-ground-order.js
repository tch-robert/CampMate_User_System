import express from 'express'
const router = express.Router()
import sequelize from '#configs/db.js'
const { C_Order, Campground_Info } = sequelize.models

// GET - 取所有營地訂單資料
router.get('/', async function (req, res) {
  try {
    const c_orders = await C_Order.findAll({ logging: console.log })
    // 處理如果沒找到資料
    if (!c_orders.length) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No tickets found' })
    }
    // 標準回傳JSON
    return res.json({ status: 'success', data: { c_orders } })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

// -----------------------------------------------------------------

// GET - 取特定 user_id 的營地訂單後，取營地資料
router.get('/user/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id)

    // 確保 user_id 是有效的數字
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Invalid user_id' })
    }

    // 查詢所有與 user_id 相關的營地訂單
    const c_orders = await C_Order.findAll({
      where: { user_id: userId },
      raw: true, // 只需要資料表中資料
    })

    // 如果沒有找到資料，返回 404
    if (c_orders.length === 0) {
      // return res.status(404).json({ status: 'error', message: '尚無營地訂單' })
      return res.json({ status: 'error', message: '尚無營地訂單' })
    }

    // 根據每個訂單中的 campground_id 查詢相關營地資料
    const campgroundIds = c_orders.map((order) => order.campground_id)

    // 查詢所有與訂單相關的營地資料
    const grounds = await Campground_Info.findAll({
      where: {
        id: campgroundIds, // 根據訂單中的 campground_id 來查詢
      },
      raw: true,
    })

    // 將訂單資料和營地資料組合並返回
    const ordersWithGround = c_orders.map((order) => {
      const campground = grounds.find((cg) => cg.id === order.campground_id)
      return {
        ...order,
        campground, // 添加對應的營地資料
      }
    })

    // 回傳所有相關資料
    return res.json({ status: 'success', data: { ordersWithGround } })
  } catch (error) {
    console.error('Error fetching c_orders:', error)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

// -----------------------------------------------------------------

export default router
