/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

// images
import logo from '@assets/images/logo.png'
import ads from '@assets/images/ads.jpg'
import videoAds from '@assets/videos/video-ads.mp4'

// utilities
import { getDate, formatQueueNumber } from '@utilities/helper'

// modals
import Modal from '@modals'

function App (props) {
  const theme = props.theme
  const { metaStates, metaMutations, metaGetters, metaActions } = window.$reduxMeta.useMeta()
  
  const meta = useCallback({
    ...metaStates('app', [
      'companyName',
      'inqueues',
      'counters',
      'ads'
    ]),

    ...metaMutations('app', [
      'SET_COUNTERS',
    ]),

    ...metaGetters('app', [
      'hasQueue',
      'getNewInQueues',
      'getServeNumber',
      'hasCounter'
    ]),

    ...metaActions('app', [
      'removeInQueue',
      'addInQueue',
      'addNewCounter',
      'getCounters',
      'getQueues'
    ])
  })
  
  const currentDate = getDate('MMMM Do YYYY')
  const [currentTime, setCurrentTime] = useState(getDate('h:mm a'))

  async function search (type) {
    if (type === 'counters') {
      await meta.getCounters({
        filter: {
          column: 'status',
          value: 1
        }
      })
      return
    }

    const params = {
      filter: {
        column: 'status',
        value: 'waiting'
      }
    }

    await meta.getQueues(params)
  }

  const renderQueues = useMemo(() => {
    let queues = []

    for (let i = 0; i < 10; i++) {
      queues.push(
        <li
          key={i}
          className={!meta.inqueues[i] ? 'empty' : ''}
        >
          {
            meta.inqueues[i]
              ? formatQueueNumber(meta.inqueues[i].ticket)
              : '----'
          }
        </li>
      )
    }

    return queues
  })

  const renderCounters = useMemo(() => {
    const counters = []
    let length = 5

    if (meta.counters.length > 5) {
      length = meta.counters.length
    }

    for (let i = 0; i < length; i++) {
      counters.push(
        <li
          key={i}
          className={!meta.counters[i] ? 'empty' : ''}
        >
          {
            meta.counters[i]
            ? <>
              <div className='counter'>
                <span>{ meta.counters[i].id }</span>
                <span>
                  counter

                  <b>{ meta.counters[i].id }</b>
                </span>
              </div>
              <div
                className={`
                  ticket-number
                  ${meta.counters[i].serving ? '' : 'avail'}
                `}
              >
                { meta.counters[i].serving ? formatQueueNumber(meta.counters[i].serving) : '----' }
              </div>
            </>
            : '----'
          }
        </li>
      )
    }

    return counters
  })

  useEffect(() => {
    window.$socket.on('current-time', time => {
      setCurrentTime(time)
    })

    window.$socket.on('refresh', types => {
      types.forEach(type => {
        search(type)
      })
    })
    
    search('counters')
    search('queues')
  }, [])

  return (
    <>
      <div className="main-container">
        <div className={`${theme}`}>
          <div className={`${theme}__now-serving`}>
            <div className={`${theme}__now-serving--title`}>
              now serving
            </div>

            <ul className={`
              ${theme}__now-serving--list
              ${meta.counters.length > 5 ? 'more' : ''}
            `}>
              { renderCounters }
            </ul>
          </div>

          <div className={`${theme}__in-queue`}>
            <div className={`${theme}__in-queue--ads`}>
              <img src={ads} alt="Ads image" />
              
              {
                meta.ads && <video
                  src={videoAds}
                  autoPlay
                  muted
                  loop
                />
              }

              <div className='date-time'>
                <span>{ currentDate }</span>
                <span>{ currentTime }</span>
              </div>
            </div>

            <div className={`${theme}__in-queue--info`}>
              <img src={logo} alt="Logo" />
              <span>{ meta.companyName }</span>
            </div>

            <div className={`${theme}__in-queue--tickets`}>
              <div className="title">in queue</div>

              <ul className='list'>
                { renderQueues }
              </ul>
            </div>
          </div>
        </div>

        {/* <Modal /> */}
      </div>
    </>
  )
}

App.propTypes = {
  theme: PropTypes.string.isRequired
}

export default App