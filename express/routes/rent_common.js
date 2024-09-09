import express from 'express'
import multer from 'multer'

import db from '#configs/mysql.js'
import authenticate from '##/middlewares/authenticate.js' // 引入身份驗證中介層

const router = express.Router()
const upload = multer()

// 新增新的取件人資訊
router.post('/pickup/:user_id', async (req, res) => {
  const userId = req.params.user_id
  console.log(userId)
  const { fullName, phone, email, defaultNum } = req.body
  console.log(fullName, phone, email, defaultNum)

  try {
    await db.query(
      `
      INSERT INTO pickup_info (
      user_id,
      full_name,
      phone,
      email,
      default_num,
      created_at,
      updated_at
      ) VALUES (
       ?,
       ?,
       ?,
       ?,
       ?,
       NOW(),
       NOW()
      )
      `,
      [userId, fullName, phone, email, defaultNum]
    )

    res.status(200).json({
      status: 'success',
      msg: '成功，已將取件人資料寫入。',
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：寫入取件人資料時，SQL錯誤。',
    })
  }
})

// 取得所有的店面資訊
router.get('/shop', async (req, res) => {
  try {
    const [shops] = await db.query(`
      SELECT 
      * 
      FROM 
      shop_info 
      `)

    res.status(200).json({
      status: 'success',
      msg: '成功，獲取所有商店資訊。',
      shops,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢店面訊息時，SQL查詢錯誤。',
    })
  }
})

// 取得所有的店面資訊
router.get('/category', async (req, res) => {
  try {
    // 這邊單純是獲取分類資訊 有機會要拆出去(還是要做try catch)
    const [category] = await db.query(`
        SELECT 
        cate1.cate_id AS child_id, cate1.cate_name AS child_name, 
        cate2.cate_id AS parent_id, cate2.cate_name AS parent_name, cate1.parent_icon 
        FROM 
        product_category AS cate1 
        LEFT JOIN 
        product_category AS cate2 ON cate1.parent_id = cate2.cate_id
        `)

    res.status(200).json({
      status: 'success',
      msg: '成功，獲取所有分類資訊。',
      category,
    })
  } catch (err) {
    console.log(`SQL查詢錯誤：${err}`)
    res.status(500).json({
      status: 'error',
      msg: '錯誤：查詢分類資訊時，SQL查詢錯誤。',
    })
  }
})

// // 取得所有的店面資訊
// router.get('/', async (req, res) => {
//   try {
//     const [shops] = await db.query(`
//       SELECT
//       *
//       FROM
//       shop_info
//       `)

//     res.status(200).json({
//       status: 'success',
//       msg: '成功，獲取所有商店資訊。',
//       shops,
//     })
//   } catch (err) {
//     console.log(`SQL查詢錯誤：${err}`)
//     res.status(500).json({
//       status: 'error',
//       msg: '錯誤：查詢店面訊息時，SQL查詢錯誤。',
//     })
//   }
// })

export default router
