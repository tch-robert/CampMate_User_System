import React, { useState, useEffect } from 'react'
import axios from 'axios'

// import OrderHistory_listCard from './orderHistory_listCard'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

// 解決Hydration問題
import dynamic from 'next/dynamic'

const OrderHistory_listCard = dynamic(() => import('./orderHistory_listCard'), {
  ssr: false,
  loading: () => (
    <Stack sx={{ marginTop: '8px' }} className="sidebar-tian" spacing={1}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          sx={{ marginBlock: '8px', bgcolor: '#f1f1f4' }}
          variant="rectangular"
          animation="wave"
          width={'100%'}
          height={202}
        />
      ))}
    </Stack>
  ),
})

import toast, { Toaster } from 'react-hot-toast'

import Loading_Circle from '@/components/tian/common/loading_circle'

export default function OrderHistory_list({
  history,
  commentToggle,
  setCommentToggle,
  orderComment,
  setOrderComment,
  getOrderComment,
  writeCommentToggle,
  shops,
}) {
  // 開啟評價商品彈出視窗
  const openComment = () => {
    if (history.order_status !== '訂單完成') {
      toast.error(`必須在完成訂單後才能評價！`)
      return
    }

    if (commentToggle === false) {
      setCommentToggle(true)
      console.log(history.order_id)
      getOrderComment(history.order_id)
      return
    }
  }

  //-----------------------------------------------------------------

  // 控制是否顯示詳細的訂單資訊
  const [showList, setShowList] = useState(false)

  const toggleList = () => {
    if (showList === false) {
      setShowList(true)
      return
    }
    setShowList(false)
  }

  //---------------------------------------------------------------

  // 控制訂單流程圖
  const orderProcess = [
    { processName: '已付款', date: '2023-12-30', time: '12:33' },
    { processName: '備貨中', date: '2023-12-31', time: '14:00' },
    { processName: '待取貨', date: '2023-12-31', time: '20:10' },
    { processName: '訂單完成', date: '2024-01-01', time: '13:04' },
  ]
  const [process, setProcess] = useState(orderProcess)

  //---------------------------------------------------------------

  const [orderItem, setOrderItem] = useState([])

  const getOrderItems = async (order_id) => {
    try {
      const url = `http://localhost:3005/api/rent_history/item/${order_id}`
      const res = await axios.get(url, { withCredentials: true })

      const status = res.data.status
      if (status === 'success') {
        setOrderItem(res.data.orderItems_rows)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //---------------------------------------------------------------
  const [pickupInfo, setPickupInfo] = useState({})

  const getPickupInfo = async () => {
    try {
      const url = `http://localhost:3005/api/rent_history/pickup/${history.pickup_id}`
      const res = await axios.get(url)
      const status = res.data.status
      if (status === 'success') {
        const pickup_info = res.data.pickup_info[0]
        setPickupInfo(pickup_info)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [orderCoupon, setOrderCoupon] = useState({})

  const getOrderCoupon = async () => {
    try {
      const url = `http://localhost:3005/api/rent_history/userCoupon/${history.user_coupon_id}`
      const res = await axios.get(url)
      const status = res.data.status
      if (status === 'success') {
        const userCoupon = res.data.userCoupon[0]
        setOrderCoupon(userCoupon)
      }
    } catch (err) {
      console.log(err)
    }
  }

  //---------------------------------------------------------------

  // 解決水合問題 在載入客戶端之後再渲染某些有問題的部分
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    getPickupInfo()
    if (history.user_coupon_id) {
      getOrderCoupon()
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      getOrderItems(history.order_id)
    }
  }, [isClient])

  const [orderStatus, setOrderStatus] = useState(0)

  useEffect(() => {
    switch (history.order_status) {
      case '已付款':
        setOrderStatus(1)
        break
      case '備貨中':
        setOrderStatus(2)
        break
      case '待取貨':
        setOrderStatus(3)
        break
      case '訂單完成':
        setOrderStatus(4)
        break
    }

    // console.log(`history:`)
    // console.log(history)
  }, [history])

  useEffect(() => {
    console.log(pickupInfo)
  }, [orderItem, shops, orderStatus, pickupInfo, orderCoupon])

  return (
    <>
      <div className="orderHistory-list-tian">
        {/*## ↓↓↓↓ 訂單標題(店名) ↓↓↓↓ */}
        <div className="listHeader">
          <div>
            <div className="shopName p1-tc-tian dark-text-tian">
              {isClient &&
                shops.length > 0 &&
                shops.find((shop) => shop.shop_id == history.shop_id).shop_name}
            </div>
            <div className="status p3-tc-tian light-text-tian">
              {isClient && history.order_status}
            </div>
            <div className="p3-tc-tian dark-text-tian align-self-end">
              下單日期： {isClient && history.create_datetime.slice(0, 10)}
            </div>
          </div>
          <div className="orderNum">
            <span className="p1-tc-tian">訂單編號:</span>
            <span className="p1-en-tian">
              {isClient && history.order_id.slice(0, 8)}
            </span>
          </div>
        </div>
        <div className={`listBody ${showList === true ? 'show' : ''}`}>
          <div className="cardHeader">
            <div className="image" />
            <div className="product p3-tc-tian sub-text-tian">商品</div>
            <div className="date p3-tc-tian sub-text-tian">租賃時段</div>
            <div className="day p3-tc-tian sub-text-tian">天數</div>
            <div className="count p3-tc-tian sub-text-tian">數量</div>
            <div className="amount p3-tc-tian sub-text-tian">價格</div>
          </div>
          {/*## ↓↓↓↓ 訂單商品卡片 ↓↓↓↓ */}
          {isClient &&
            orderItem.map((item, i) => {
              return (
                <OrderHistory_listCard
                  key={item.id}
                  item={item}
                  history={history}
                />
              )
            })}
        </div>
        {history.user_coupon_id && (
          <div className="couponInfo">
            <div className="d-flex align-items-center gap-1">
              <span className="couponIcon material-symbols-outlined prompt-text-tian">
                local_activity
              </span>
              <span className="couponName coupon p2-tc-tian sub-text-tian">
                {orderCoupon.coupon_name}
              </span>
            </div>

            <span className="discount p2-tc-tian prompt-text-tian">
              <span className="p3-tc-tian">折抵</span>
              {` $`}
              {history.discount.toLocaleString()}
            </span>
          </div>
        )}

        <div className={`listForm  ${showList === true ? '' : 'd-none'}`}>
          <div className="pickup">
            <span className="pickupTitle p2-tc-tian dark-text-tian">
              取件人
            </span>
            <div className="pickupBody">
              <span className="name p2-tc-tian sub-text-tian">
                姓名: {` `}
                {pickupInfo.full_name}
              </span>
              <span className="phone p2-tc-tian sub-text-tian">
                電話: {` `}
                {pickupInfo.phone}
              </span>
              <span className="email p2-tc-tian sub-text-tian">
                Email: {` `}
                {pickupInfo.email}
              </span>
            </div>
          </div>
          <div className="note">
            <span className="noteTitle p2-tc-tian dark-text-tian">備註</span>
            <div
              className={`p2-tc-tian ${
                history.notes ? 'dark-text-tian' : 'sub-text-tian'
              } `}
            >
              {history.notes ? history.notes : '此訂單無備註內容'}
            </div>
          </div>
        </div>
        <div className={`orderProcess ${showList === true ? '' : 'd-none'}`}>
          <div className="processBody">
            <div className="processItem">
              <div className="processCircle">
                <div className="insideCircle" />
              </div>
              <div className="processContent">
                <div className="processTitle p2-tc-tian">收到訂單</div>
                {/* <div className="processDatetime">
                  <span className="date p3-en-tian">2023-12-30</span>
                  <span className="time p3-en-tian">09:30</span>
                </div> */}
              </div>
            </div>
            {process.slice(0, Number(orderStatus)).map((v, i) => {
              return (
                <React.Fragment key={i}>
                  <div className="processLine" />
                  <div className="processItem">
                    <div className="processCircle">
                      <div className="insideCircle" />
                    </div>
                    <div className="processContent">
                      <div className="processTitle p2-tc-tian">
                        {v.processName}
                      </div>
                      {/* <div className="processDatetime">
                        <span className="date p3-en-tian">{v.date}</span>
                        <span className="time p3-en-tian">{v.time}</span>
                      </div> */}
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
        <div className="listFooter">
          <button onClick={toggleList} className="none-btn-tian openList">
            {showList === false ? (
              <span className="down material-symbols-outlined dark-text-tian">
                keyboard_arrow_down
              </span>
            ) : (
              <span className="up material-symbols-outlined dark-text-tian">
                keyboard_arrow_up
              </span>
            )}
          </button>
          <div>
            <div className="total">
              <span className="dark-text-tian p2-tc-tian">訂單金額：</span>
              <div className="totalPrice p1-en-tian error-text-tian">
                <span>$</span>
                <span>{history.amount.toLocaleString()}</span>
              </div>
            </div>
            {/* <button className="contact p1-tc-tian btn primary2-outline-btn-tian">
              聯絡我們
            </button> */}
            {history.order_status === '訂單完成' && (
              <button
                onClick={openComment}
                className={`comment p1-tc-tian btn ${
                  history.order_status !== '訂單完成'
                    ? 'error-btn-tian'
                    : 'primary2-btn-tian'
                }`}
              >
                評價商品
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
