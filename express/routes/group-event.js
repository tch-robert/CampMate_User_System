import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Group_event, Group_Organizer, Campground_Info, Room, Room_Img } =
  sequelize.models

// --------------------------------------------------------

// GET - 得到所有團露活動資料
router.get('/', async function (req, res) {
  const events = await Group_event.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  // return res.json({ status: 'success', data: { events } })
  return res.json(events)
})

// --------------------------------------------------------

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)，並查詢對應的圖片
router.get('/:id', async function (req, res) {
  try {
    // 轉為數字
    const id = Number(req.params.id)
    // 取活動資料
    const event = await Group_event.findByPk(id, {
      // findByPk以主鍵查詢
      raw: true, // 只需要資料表中資料
    })
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    // 根據 ground_id 查詢對應的圖片資料
    const images = await sequelize.models.Campground_Img.findAll({
      where: { campground_id: event.ground_id },
      raw: true,
    })

    // 將活動資料與圖片一起回傳
    return res.json({
      event,
      images: images.map((img) => img.path), // 只回傳圖片路徑
    })
  } catch (error) {
    console.error('Error fetching event or images:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }

  // return res.json({ status: 'success', data: { event } })
  // return res.json([event])
})

// --------------------------------------------------------

export default router
