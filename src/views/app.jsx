/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

// images
import logo from '@assets/images/logo.png'
import ads from '@assets/images/ads.jpg'
import videoAds from '@assets/videos/video-ads.mp4'

// utilities
import { getDate, formatQueueNumber } from '@utilities/helper'
import socket from '@utilities/socket'

// hooks
import useTextToSpeech from '@hooks/useTextToSpeech'

// modals
// import Modal from '@modals'

function App (props) {
  const theme = props.theme
  const { speak } = useTextToSpeech()
  const { metaStates, metaMutations, metaGetters, metaActions } = window.$reduxMeta.useMeta()
  
  const meta = useCallback({
    ...metaStates('app', [
      'session',
      'companyName',
      'inqueues',
      'counters',
      'ads'
    ]),

    ...metaMutations('app', [
      'SET_COUNTERS',
      'SET_SESSION'
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
    const availableCounters = meta.counters.filter(x => x.session)
    const res = []
    let length = 5

    if (meta.counters.length > 5) {
      length = meta.counters.length
    }

    for (let i = 0; i < length; i++) {
      res.push(
        <li
          key={i}
          className={!availableCounters[i] ? 'empty' : ''}
        >
          {
            availableCounters[i]
            ? <>
              <div className='counter'>
                <span>{ availableCounters[i].id }</span>
                <span>
                  counter

                  <b>{ availableCounters[i].id }</b>
                </span>
              </div>
              <div
                className={`
                  ticket-number
                  ${availableCounters[i].serving ? '' : 'avail'}
                `}
              >
                { availableCounters[i].serving ? formatQueueNumber(availableCounters[i].serving) : '----' }
              </div>
            </>
            : '----'
          }
        </li>
      )
    }

    return res
  })

  useEffect(() => {
    socket.on('current-time', time => {
      setCurrentTime(time)
    })

    socket.on('refresh', types => {
      types.forEach(type => {
        search(type)
      })
    })

    socket.on('session-start', () => {
      localStorage.setItem('session-start', 1)
      meta.SET_SESSION(1)
    })

    socket.on('session-stop', () => {
      localStorage.clear()
      meta.SET_SESSION(0)
    })

    socket.on('monitor:call-again', data => {
      speak(`Ticket number ${formatQueueNumber(data.ticket)}, please proceed to counter ${data.counter}.`, 'f')
    })

    if (localStorage.getItem('session-start')) {
      meta.SET_SESSION(1)
    }
    
    search('counters')
    search('queues')
  }, [])

  return (
    <>
      <div className="main-container">
        <div className={`${theme}`}>
          <div className={`${theme}__now-serving ${!meta.session ? 'hide' : ''}`}>
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

          <div className={`${theme}__in-queue ${!meta.session ? 'fullsize' : ''}`}>
            <div className={`${theme}__in-queue--ads ${!meta.session ? 'fullsize' : ''}`}>
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

            <div className={`${theme}__in-queue--tickets ${!meta.session ? 'hide' : ''}`}>
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