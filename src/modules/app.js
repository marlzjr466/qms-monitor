import { baseApi } from '@utilities/axios'

export default () => ({
  metaModule: true,
  name: 'app',

  metaStates: {
    session: 0,
    companyName: 'Queueing Management System',
    inqueues: [],
    counters: [],
    serveNumber: 0,
    ads: null
  },

  metaMutations: {
    SET_SESSION: (state, { payload }) => {
      state.session = payload
    },

    SET_COUNTERS: (state, { payload }) => {
      state.counters = payload
    },

    SET_SERVE_NUMBER: (state, { payload }) => {
      state.serveNumber = payload
    },
    
    SET_IN_QUEUES: (state, { payload }) => {
      const newQueue = state.inqueues
      newQueue.push(payload)

      state.inqueues = [...new Set(newQueue)]
    },
    
    SET_QUEUES: (state, { payload }) => {
      state.inqueues = payload
    }
  },

  metaGetters: {
    hasQueue (state) {
      return state.inqueues.filter(i => i)
    },

    hasCounter (state) {
      return state.counters.filter(i => i)
    },

    getServeNumber (state) {
      if (!state.inqueues.length) {
        return 0
      }

      return state.inqueues[0]
    },

    getNewInQueues (state) {
      return state.inqueues.filter((_, i) => i > 0)
    }
  },

  metaActions: {
    addInQueue ({ commit, state }, number) {
      const newQueue = [
        ...state.inqueues,
        number
      ]

      commit('SET_QUEUES', [...new Set(newQueue)])
    },

    removeInQueue ({ commit, state }) {
      if (!state.inqueues.length) {
        return
      }

      const newQueues = state.inqueues.filter((_, i) => i > 0)
      commit('SET_QUEUES', newQueues)
    },

    async getCounters ({ commit }, params = {}) {
      try {
        const counters = await baseApi.post('/qms/counters/list', params)

        commit('SET_COUNTERS', counters.data)
      } catch (error) {
        console.log('getCounters error:', error)
      }
    },

    async getQueues ({ commit }, params = {}) {
      try {
        const queues = await baseApi.post('/qms/queues/list', params)

        commit('SET_QUEUES', queues.data)
      } catch (error) {
        console.log('getQueues error:', error)
      }
    }
  }
})