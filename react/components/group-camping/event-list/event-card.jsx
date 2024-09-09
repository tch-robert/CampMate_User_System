import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './event-card.module.scss'

export default function EventCard({ events, isLoading }) {
  const [participants, setParticipants] = useState({})

  // 根據 event_id 取得參與人數
  const getParticipants = async (event_id) => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/group-participant/event/${event_id}`
      )
      if (!res.ok) {
        throw new Error('Failed to fetch participants')
      }
      const data = await res.json()
      // 過濾出 attendance_status 為 'attended' 的成員
      const attendedParticipants = data.filter(
        (participant) => participant.attendence_status === 'attended'
      )
      return attendedParticipants.length // 取團員人數
    } catch (error) {
      console.error('Error fetching participants:', error)
      return 0 // 如果發生錯誤，返回 0 人
    }
  }

  useEffect(() => {
    const fetchCounts = async () => {
      const counts = {} // 用來儲存每個活動的參與人數
      for (const event of events) {
        const count = await getParticipants(event.event_id) // 根據 event_id 抓取資料
        counts[event.event_id] = count // 儲存活動的參與人數
      }
      setParticipants(counts) // 將參與人數更新到 state
    }

    if (events.length > 0) {
      fetchCounts() // 如果有活動資料，則執行抓取
    }
  }, [events]) // 當 events 改變時重新執行

  // --------------------------------------------------

  return (
    <>
      {isLoading ? (
        <p>Loading...</p> // 資料載入時顯示 Loading
      ) : (
        events.map((event) => {
          return (
            <div
              key={event.event_id}
              className={`${styles.eventCard} ${styles.globe}`}
            >
              <Image
                src={event.images}
                alt="Event Image"
                width={254}
                height={195}
                objectFit="cover"
              />
              <div className={styles.cardContent}>
                <div className={`${styles.title} ${styles.p1Tc}`}>
                  {event.event_name}
                </div>
                <hr />
                <div className={styles.bottom}>
                  <div className={styles.info}>
                    <div className={`${styles.item} ${styles.location}`}>
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      <span className={styles.p2Tc}>{event.ground_city}</span>
                    </div>
                    <div className={`${styles.item} ${styles.date}`}>
                      <span className="material-symbols-outlined">
                        calendar_today
                      </span>
                      <span className={styles.p2En}>
                        from {event.start_date}
                        <br />
                        to {event.end_date}
                      </span>
                    </div>
                    <div className={`${styles.item} ${styles.num}`}>
                      <span className="material-symbols-outlined">person</span>
                      <span className={styles.p2En}>
                        {participants[event.event_id] + 1 || 1} /{' '}
                        {event.max_member}
                      </span>
                    </div>
                  </div>
                  {/* <Link href="/group-camping/event-detail"> */}
                  <Link href={`/group-camping/event-detail/${event.event_id}`}>
                    <div className={`${styles.btnMore} ${styles.p2Tc}`}>
                      了解更多
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
