/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

function Modal () {
  return (
    <>
      <div className='modal-container'>
        <div className="modal-container__panel">
          <div className="modal-container__panel--label">
            queue number:
          </div>

          <div className="modal-container__panel--number">
            0002
          </div>

          <p>Please proceed to counter 1</p>
        </div>
      </div>
    </>
  )
}

export default Modal