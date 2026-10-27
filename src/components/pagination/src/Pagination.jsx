import React, { useState } from 'react'
import classNames from 'classnames'
import Select from '../../select/src/Select'
import Option from '../../select/src/Option'
import { useSyncedState } from '../../../hooks/useSyncedState'

const TEXTS = {
  prevText: 'Previous Page',
  nextText: 'Next Page',
  prev5Text: 'Previous 5 Pages',
  next5Text: 'Next 5 Pages',
  total: 'Total',
  items: 'items',
  goto: 'Goto',
  pageText: 'page',
  pageSize: '/ page'
}

const ALLOWED_KEYS = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Home', 'End']

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

/**
 * `onChange(page)` fires when the page changes, `onPageSizeChange(size)` when
 * a new page size is picked from the sizer.
 */
const Pagination = (props) => {
  const {
    current: currentProp = 1,
    total = 0,
    pageSize: pageSizeProp = 10,
    size,
    simple = false,
    showTotal = false,
    showQuickjump = false,
    showSizer = false,
    pageSizeOpts = [10, 20, 30, 40],
    texts: textsProp,
    onChange,
    onPageSizeChange,
    className,
    children,
    ...restProps
  } = props

  const texts = { ...TEXTS, ...textsProp }

  const [currentPage, setCurrentPage] = useSyncedState(currentProp, 1)
  const [currentPageSize, setCurrentPageSize] = useSyncedState(pageSizeProp, 10)
  // Text typed in the jump box; null means "show the current page".
  const [jumpText, setJumpText] = useState(null)

  const totalPage = Math.ceil(total / currentPageSize) || 1
  const jumpValue = jumpText !== null ? jumpText : String(currentPage)

  const changePage = (page, pageTotal = totalPage) => {
    const num = clamp(parseInt(page, 10) || 1, 1, pageTotal)
    setJumpText(null)

    if (num !== currentPage) {
      setCurrentPage(num)
      if (onChange) onChange(num)
    }
  }

  const handlePrev = () => {
    if (currentPage > 1) changePage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPage) changePage(currentPage + 1)
  }

  const handleJumpPrev = () => changePage(currentPage - 5)
  const handleJumpNext = () => changePage(currentPage + 5)

  const handleKeyDown = (evt) => {
    if (evt.ctrlKey || evt.metaKey) return
    if (!/^\d$/.test(evt.key) && !ALLOWED_KEYS.includes(evt.key)) {
      evt.preventDefault()
    }
  }

  const handleJumpKeyUp = (evt) => {
    if (evt.key === 'Enter') {
      changePage(jumpValue)
    } else if (evt.key === 'ArrowDown') {
      handlePrev()
    } else if (evt.key === 'ArrowUp') {
      handleNext()
    }
  }

  const changeSize = (newSize) => {
    const size = Number(newSize)
    setCurrentPageSize(size)
    // The page count changes with the page size, so go back to page 1.
    if (currentPage !== 1) {
      setCurrentPage(1)
      if (onChange) onChange(1)
    }
    if (onPageSizeChange) onPageSizeChange(size)
  }

  const paginationClasses = classNames(
    'at-pagination',
    {
      [`at-pagination--${size}`]: size,
      'at-pagination--simple': simple
    },
    className
  )

  const prev = (
    <li
      className={classNames('at-pagination__prev', {
        'at-pagination--disabled': currentPage === 1
      })}
      onClick={handlePrev}
      title={texts.prevText}
    >
      <i className="icon icon-chevron-left" />
    </li>
  )

  const next = (
    <li
      className={classNames('at-pagination__next', {
        'at-pagination--disabled': currentPage === totalPage
      })}
      onClick={handleNext}
      title={texts.nextText}
    >
      <i className="icon icon-chevron-right" />
    </li>
  )

  if (simple) {
    return (
      <ul className={paginationClasses} {...restProps}>
        {prev}
        <div className="at-pagination__simple-paging">
          <input
            type="text"
            className="at-input__original"
            value={jumpValue}
            onKeyDown={handleKeyDown}
            onKeyUp={handleJumpKeyUp}
            onChange={(evt) => setJumpText(evt.target.value)}
            onBlur={() => setJumpText(null)}
          />
          <span>/</span>
          <span className="at-pagination__paging-total">{totalPage}</span>
        </div>
        {next}
      </ul>
    )
  }

  // Visible window of page numbers (used when there are fewer than 9 pages)
  const pageRange = []
  const visiblePage = Math.min(totalPage, 5)
  let start = 1

  if (currentPage + visiblePage / 2 > totalPage) {
    start = Math.max(totalPage - visiblePage + 1, 1)
  } else if (currentPage - visiblePage / 2 > 0) {
    start = Math.ceil(currentPage - visiblePage / 2)
  }

  for (let i = 0; i < visiblePage; i++) {
    pageRange.push(start + i)
  }

  const item = (num, extra) => (
    <li
      key={num}
      className={classNames('at-pagination__item', {
        'at-pagination__item--active': currentPage === num
      }, extra)}
      onClick={() => changePage(num)}
    >
      {num}
    </li>
  )

  return (
    <ul className={paginationClasses} {...restProps}>
      {showTotal && (
        <span className="at-pagination__total">
          {children !== undefined ? children : `${texts.total} ${total} ${texts.items}`}
        </span>
      )}
      {prev}
      {totalPage < 9 ? (
        pageRange.map(num => item(num))
      ) : (
        <>
          {item(1)}
          {currentPage > 4 && (
            <li
              className="at-pagination__item at-pagination__item--jump-prev"
              title={texts.prev5Text}
              onClick={handleJumpPrev}
            >
              <i className="icon icon-chevrons-left" />
            </li>
          )}
          {currentPage > 3 && item(currentPage - 2)}
          {currentPage > 2 && item(currentPage - 1)}
          {currentPage !== 1 && currentPage !== totalPage && item(currentPage)}
          {currentPage < totalPage - 1 && item(currentPage + 1)}
          {currentPage < totalPage - 2 && item(currentPage + 2)}
          {currentPage < totalPage - 3 && (
            <li
              className="at-pagination__item at-pagination__item--jump-next"
              title={texts.next5Text}
              onClick={handleJumpNext}
            >
              <i className="icon icon-chevrons-right" />
            </li>
          )}
          {item(totalPage)}
        </>
      )}
      {next}
      {showSizer && (
        <div className="at-pagination__sizer">
          <Select value={currentPageSize} size={size} onChange={changeSize}>
            {pageSizeOpts.map(opt => (
              <Option key={opt} value={opt}>{`${opt} ${texts.pageSize}`}</Option>
            ))}
          </Select>
        </div>
      )}
      {showQuickjump && (
        <div className="at-pagination__quickjump">
          <span>{texts.goto}</span>
          <input
            type="text"
            className="at-input__original"
            value={jumpValue}
            onKeyDown={handleKeyDown}
            onKeyUp={(evt) => evt.key === 'Enter' && changePage(jumpValue)}
            onChange={(evt) => setJumpText(evt.target.value)}
            onBlur={() => setJumpText(null)}
          />
          <span>{texts.pageText}</span>
        </div>
      )}
    </ul>
  )
}

Pagination.displayName = 'AtPagination'

export default Pagination
