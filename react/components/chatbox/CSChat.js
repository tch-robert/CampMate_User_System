import React, { useState, useRef, useEffect } from 'react'
import styles from '@/styles/chatbox/chatbox.module.css'
import { useChatByUserId, register } from '@/services/chatbox'
import toast from 'react-hot-toast'
import { mutate } from 'swr' // 確保從 'swr' 導入 mutate

export default function CSChat({ user_id }) {
  console.log('userId:', user_id) // 確保 userId 正確
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false) // 檢查是否有新訊息
  const contentBoxRef = useRef(null)
  const latestMessageIdRef = useRef(null) // 保存最新的消息ID

  // 使用 useChatByUserId hook 來獲取聊天記錄
  const { data: messages = [], isLoading, isError } = useChatByUserId(user_id)

  useEffect(() => {
    if (isError) {
      console.error('Error fetching messages:', isError)
    } else {
      // 新增日誌檢查 messages
      // console.log('Fetched messages:', messages)
      if (Array.isArray(messages)) {
        // 獲取最新的消息ID
        const latestMessage = messages[messages.length - 1]
        if (latestMessage) {
          const latestMessageId = latestMessage.message_id
          if (
            latestMessageIdRef.current &&
            latestMessageIdRef.current !== latestMessageId
          ) {
            setHasNewMessages(true) // 有新訊息
          }
          latestMessageIdRef.current = latestMessageId // 更新最新消息ID
        }
      } else {
        console.warn('Messages is not an array:', messages)
      }
    }
  }, [messages, isError])

  // 定期輪詢聊天記錄，每 1 秒重新獲取一次聊天記錄
  useEffect(() => {
    const intervalId = setInterval(() => {
      mutate(`http://localhost:3005/api/chat_box/${user_id}`)
    }, 1000) // 每 1 秒重新獲取一次聊天記錄

    return () => clearInterval(intervalId) // 組件卸載時清除定時器
  }, [user_id])

  const getFormattedTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFormattedDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
    })
  }

  const getMessagesWithDates = () => {
    if (!Array.isArray(messages)) {
      console.warn('Messages is not an array:', messages)
      return [] // 如果 messages 不是數組，返回空數組
    }

    const messagesWithDates = []
    let lastDate = ''

    messages.forEach((msg) => {
      const currentDate = getFormattedDate(msg.created_at)

      if (currentDate !== lastDate) {
        messagesWithDates.push({
          type: 'date',
          date: currentDate,
        })
        lastDate = currentDate
      }

      messagesWithDates.push({
        ...msg,
        time: getFormattedTime(msg.created_at), // 格式化時間
        date: currentDate, // 格式化日期
      })
    })

    return messagesWithDates
  }

  // 滾動到最新消息
  useEffect(() => {
    if (contentBoxRef.current) {
      contentBoxRef.current.scrollTop = contentBoxRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) {
      return toast.error('請輸入訊息')
    }

    const message = {
      user_id: user_id,
      sender_id: 9999,
      text,
    }

    setIsSending(true)

    try {
      console.log('Submitting message:', message)
      const response = await register(message)

      console.log('Response from register:', response)

      if (response.status === 'success') {
        // 清空文本框
        setText('')
        // 刷新聊天記錄
        mutate(`http://localhost:3005/api/chat_box/${user_id}`) // 確保使用正確的 SWR 快取鍵
        console.log('送出訊息:', message)
      } else {
        toast.error('送出訊息失敗')
      }
    } catch (error) {
      console.error('Error creating message:', error)
      toast.error(
        `送出訊息時發生錯誤: ${error.message || JSON.stringify(error)}`
      )
    } finally {
      setIsSending(false)
    }
  }

  const getUserLabel = (senderId) => {
    if (senderId === 9999) {
      return '客服'
    }

    // 根據 senderId 查找對應的用戶信息
    const user = messages.find((msg) => msg.sender_id === senderId)?.User
    return user ? user.name : `用戶 ${senderId}`
  }

  return (
    <div className={styles.box}>
      <div className={styles.contentBox} ref={contentBoxRef}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          getMessagesWithDates().map((msg, index) =>
            msg.type === 'date' ? (
              <div key={index} className={styles.dateMessage}>
                {msg.date}
              </div>
            ) : (
              <div
                key={index}
                className={
                  msg.sender_id === 9999
                    ? styles.userMessage
                    : styles.supportMessage
                }
              >
                <span className={styles.chatUser}>
                  {getUserLabel(msg.sender_id)} :
                </span>
                <div className={styles.chatContent}>{msg.text}</div>
                <span className={styles.chatTime}>{msg.time}</span>
              </div>
            )
          )
        )}
      </div>
      <form className={styles.sendForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.sendInput}
          placeholder="輸入訊息"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className={styles.sendBtn} disabled={isSending}>
          發送
        </button>
      </form>
    </div>
  )
}
