import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

const Pagination = (props) => {
  const {
    current: currentProp = 1,
    total,
    pageSize = 10,
    size,
    simple = false,
    showTotal = false,
    showQuickjump = false,
    showSizer = false,
    pageSizeOpts = [10, 20, 30, 40],
    onChange,
    onPageSizeChange,
    className,
    children,
    ...restProps
  } = props

  const [currentPage, setCurrentPage] = useState(currentProp)
  const [currentPageSize, setCurrentPageSize] = useState(pageSize)
  const [jumpPageNum, setJumpPageNum] = useState(currentProp)

  useEffect(() => {
    setCurrentPage(currentProp)
    setJumpPageNum(currentProp)
  }, [currentProp])

  useEffect(() => {
    setCurrentPageSize(pageSize)
  }, [pageSize])

  const totalPage = Math.ceil(total / currentPageSize) || 1

  // Hardcoded English strings (locale removed)
  const texts = {
    prevText: 'Previous Page',
    nextText: 'Next Page',
    total: 'Total',
    items: 'items',
    goto: 'Goto',
    pageText: 'page',
    prev5Text: 'Previous 5 Pages',
    next5Text: 'Next 5 Pages'
  }

  const changePage = (page) => {
    let num = (page || jumpPageNum || 1) | 0
    num = num > totalPage ? totalPage : num
    num = num < 1 ? 1 : num

    if (currentPage !== num) {
      setJumpPageNum(num)
      setCurrentPage(num)
      if (onChange) {
        onChange(num)
      }
    }
  }

  const handlePrev = () => {
    if (currentPage <= 1) return
    changePage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage >= totalPage) return
    changePage(currentPage + 1)
  }

  const handleJumpPrev = () => {
    const page = currentPage - 5
    changePage(page > 0 ? page : 1)
  }

  const handleJumpNext = () => {
    const page = currentPage + 5
    changePage(page > totalPage ? totalPage : page)
  }

  const handleKeydown = (evt) => {
    const key = evt.keyCode
    if (!((key >= 48 && key <= 57) || key === 8 || key === 37 || key === 39)) {
      evt.preventDefault()
    }
  }

  const handleKeyup = (evt) => {
    const key = evt.keyCode
    const numVal = parseInt(evt.target.value) || 1

    if (key === 40) {
      handlePrev()
    } else if (key === 38) {
      handleNext()
    } else if (key === 13) {
      let page = numVal > totalPage ? totalPage : numVal
      page = numVal <= 0 ? 1 : page
      evt.target.value = page
      changePage(page)
    }
  }

  const changeSize = (size) => {
    setCurrentPageSize(size)
    changePage(1)
    if (onPageSizeChange) {
      onPageSizeChange(size)
    }
  }

  const paginationClasses = classNames(
    'at-pagination',
    {
      [`at-pagination--${size}`]: size,
      'at-pagination--simple': simple
    },
    className
  )

  // Simple pagination
  if (simple) {
    return (
      <ul className={paginationClasses} {...restProps}>
        <li
          className={classNames('at-pagination__prev', {
            'at-pagination--disabled': currentPage === 1
          })}
          onClick={handlePrev}
          title={texts.prevText}
        >
          <i className="icon icon-chevron-left" />
        </li>
        <div className="at-pagination__simple-paging">
          <input
            type="text"
            className="at-input__original"
            value={currentPage}
            onKeyDown={handleKeydown}
            onKeyUp={handleKeyup}
            onChange={(e) => setJumpPageNum(parseInt(e.target.value) || 1)}
          />
          <span>/</span>
          <span className="at-pagination__paging-total">{totalPage}</span>
        </div>
        <li
          className={classNames('at-pagination__next', {
            'at-pagination--disabled': currentPage === totalPage
          })}
          onClick={handleNext}
          title={texts.nextText}
        >
          <i className="icon icon-chevron-right" />
        </li>
      </ul>
    )
  }

  // Full pagination
  const pageRange = []
  const visiblePage = totalPage >= 5 ? 5 : totalPage
  let start = 1

  if (currentPage + (visiblePage / 2) > totalPage) {
    start = totalPage - visiblePage + 1
    start = start > 0 ? start : 1
  } else if (currentPage - (visiblePage / 2) > 0) {
    start = Math.ceil(currentPage - (visiblePage / 2))
  }

  for (let i = 0; i < visiblePage && i < totalPage; i++) {
    pageRange.push(start + i)
  }

  return (
    <ul className={paginationClasses} {...restProps}>
      {showTotal && (
        <span className="at-pagination__total">
          {children || `${texts.total} ${total} ${texts.items}`}
        </span>
      )}
      <li
        className={classNames('at-pagination__prev', {
          'at-pagination--disabled': currentPage === 1
        })}
        onClick={handlePrev}
        title={t('at.pagination.prevText')}
      >
        <i className="icon icon-chevron-left" />
      </li>
      {totalPage < 9 ? (
        pageRange.map(num => (
          <li
            key={num}
            className={classNames('at-pagination__item', {
              'at-pagination__item--active': currentPage === num
            })}
            onClick={() => changePage(num)}
          >
            {num}
          </li>
        ))
      ) : (
        <>
          <li
            className={classNames('at-pagination__item', {
              'at-pagination__item--active': currentPage === 1
            })}
            onClick={() => changePage(1)}
          >
            1
          </li>
          {currentPage > 4 && (
            <li
              className="at-pagination__item at-pagination__item--jump-prev"
              title={texts.prev5Text}
              onClick={handleJumpPrev}
            >
              <i className="icon icon-chevrons-left" />
            </li>
          )}
          {currentPage > 3 && (
            <li className="at-pagination__item" onClick={() => changePage(currentPage - 2)}>
              {currentPage - 2}
            </li>
          )}
          {currentPage > 2 && (
            <li className="at-pagination__item" onClick={() => changePage(currentPage - 1)}>
              {currentPage - 1}
            </li>
          )}
          {currentPage !== 1 && currentPage !== totalPage && (
            <li className="at-pagination__item at-pagination__item--active">
              {currentPage}
            </li>
          )}
          {currentPage < totalPage - 1 && (
            <li className="at-pagination__item" onClick={() => changePage(currentPage + 1)}>
              {currentPage + 1}
            </li>
          )}
          {currentPage < totalPage - 2 && (
            <li className="at-pagination__item" onClick={() => changePage(currentPage + 2)}>
              {currentPage + 2}
            </li>
          )}
          {currentPage < totalPage - 3 && (
            <li
              className="at-pagination__item at-pagination__item--jump-next"
              title={texts.next5Text}
              onClick={handleJumpNext}
            >
              <i className="icon icon-chevrons-right" />
            </li>
          )}
          {totalPage > 1 && (
            <li
              className={classNames('at-pagination__item', {
                'at-pagination__item--active': currentPage === totalPage
              })}
              onClick={() => changePage(totalPage)}
            >
              {totalPage}
            </li>
          )}
        </>
      )}
      <li
        className={classNames('at-pagination__next', {
          'at-pagination--disabled': currentPage === totalPage
        })}
        onClick={handleNext}
        title={t('at.pagination.nextText')}
      >
        <i className="icon icon-chevron-right" />
      </li>
      {showQuickjump && (
        <div className="at-pagination__quickjump">
          <span>{texts.goto}</span>
          <input
            type="text"
            className="at-input__original"
            value={jumpPageNum}
            onKeyDown={handleKeydown}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                changePage()
              }
            }}
            onChange={(e) => setJumpPageNum(parseInt(e.target.value) || 1)}
          />
          <span>{texts.pageText}</span>
        </div>
      )}
    </ul>
  )
}

Pagination.displayName = 'AtPagination'

export default Pagination

