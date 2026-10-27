import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import Checkbox from '../../checkbox/src/Checkbox'
import Pagination from '../../pagination/src/Pagination'

const SORT_CYCLE = ['normal', 'desc', 'asc']

const initialSelection = (data) => {
  const selected = new Set()
  data.forEach((row, index) => {
    if (row && row.isChecked) selected.add(index)
  })
  return selected
}

const initialSort = (columns) => {
  for (let i = 0; i < columns.length; i++) {
    const type = columns[i].sortType
    if (type && type !== 'normal') return { index: i, order: type }
  }
  return { index: -1, order: 'normal' }
}

const sameLayout = (a, b) =>
  a.bodyHeight === b.bodyHeight &&
  a.headerHeight === b.headerHeight &&
  a.widths.length === b.widths.length &&
  a.widths.every((width, i) => width === b.widths[i])

/**
 * Columns: `{ title, key, width, className, sortType, sortMethod, render }`.
 * `render(row, { index, column })` returns the cell content. Sorting on a
 * column needs `sortType` ('normal', 'asc' or 'desc') to be set on it.
 *
 * Callbacks: `onSortChange({ column, order, key })`,
 * `onSelectionChange(rows)`, `onSelectAll(rows)`, `onPageChange(page)` and
 * `onPageSizeChange(size)`.
 */
const Table = (props) => {
  const {
    size = 'normal',
    stripe = false,
    border = false,
    data = [],
    columns = [],
    optional = false,
    pagination = false,
    pageSize: pageSizeProp = 10,
    showPageTotal = true,
    showPageSizer = false,
    showPageQuickjump = false,
    height,
    width,
    emptyText = 'No Data',
    onSortChange,
    onSelectionChange,
    onSelectAll,
    onPageChange,
    onPageSizeChange,
    className,
    style,
    ...restProps
  } = props

  const [sort, setSort] = useState(() => initialSort(columns))
  const [selected, setSelected] = useState(() => initialSelection(data))
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeProp)
  const [layout, setLayout] = useState({ bodyHeight: 0, headerHeight: 0, widths: [] })

  const headerRef = useRef(null)
  const footerRef = useRef(null)
  const bodyRef = useRef(null)

  // Reset the selection (and keep props in sync) when the inputs change.
  const [prevData, setPrevData] = useState(data)
  if (prevData !== data) {
    setPrevData(data)
    setSelected(initialSelection(data))
  }
  const [prevPageSize, setPrevPageSize] = useState(pageSizeProp)
  if (prevPageSize !== pageSizeProp) {
    setPrevPageSize(pageSizeProp)
    setPageSize(pageSizeProp)
  }

  // --- rows: sort, then paginate ------------------------------------------
  const sortedRows = useMemo(() => {
    const rows = data.map((row, index) => ({ row, index }))
    const column = columns[sort.index]

    if (column && sort.order !== 'normal') {
      const { key, sortMethod } = column
      rows.sort((a, b) => {
        if (sortMethod) return sortMethod(a.row[key], b.row[key], sort.order)
        if (sort.order === 'asc') return a.row[key] > b.row[key] ? 1 : -1
        return a.row[key] < b.row[key] ? 1 : -1
      })
    }
    return rows
  }, [data, columns, sort])

  const total = sortedRows.length
  const pageCount = Math.max(Math.ceil(total / pageSize), 1)
  const currentPage = Math.min(page, pageCount)
  const pageRows = pagination
    ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedRows

  // --- selection -----------------------------------------------------------
  const selectionRows = (set) => data.filter((_, index) => set.has(index))

  const isSelectAll = pageRows.length > 0 && pageRows.every(({ index }) => selected.has(index))

  const handleSelectAll = () => {
    const next = new Set(selected)
    const status = !isSelectAll
    pageRows.forEach(({ index }) => (status ? next.add(index) : next.delete(index)))
    setSelected(next)

    const rows = selectionRows(next)
    if (status && onSelectAll) onSelectAll(rows)
    if (onSelectionChange) onSelectionChange(rows)
  }

  const handleSelectRow = (index, checked) => {
    const next = new Set(selected)
    if (checked) next.add(index)
    else next.delete(index)
    setSelected(next)
    if (onSelectionChange) onSelectionChange(selectionRows(next))
  }

  // --- sorting -------------------------------------------------------------
  const handleSort = (columnIndex, type) => {
    const column = columns[columnIndex]
    if (!column.sortType) return

    const current = sort.index === columnIndex ? sort.order : 'normal'
    const order = type || SORT_CYCLE[(SORT_CYCLE.indexOf(current) + 1) % SORT_CYCLE.length]

    setSort(order === 'normal' ? { index: -1, order } : { index: columnIndex, order })
    if (onSortChange) onSortChange({ column, order, key: column.key })
  }

  // --- fixed-height layout -------------------------------------------------
  const measure = useCallback(() => {
    if (!height) return

    const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0
    const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 0
    const firstRow = bodyRef.current && bodyRef.current.querySelector('tbody tr')
    const cells = firstRow ? Array.from(firstRow.children) : []
    const offset = optional ? 1 : 0

    const widths = columns.map((column, i) => {
      if (column.width) return column.width
      const cell = cells[i + offset]
      return cell ? cell.offsetWidth : ''
    })

    const next = { bodyHeight: Number(height) - headerHeight - footerHeight, headerHeight, widths }
    setLayout(prev => (sameLayout(prev, next) ? prev : next))
  }, [height, columns, optional])

  useLayoutEffect(() => {
    measure()
  })

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // --- rendering -----------------------------------------------------------
  const colgroup = (
    <colgroup>
      {optional && <col width={40} />}
      {columns.map((column, i) => (
        <col key={column.key || i} width={layout.widths[i] || column.width || ''} />
      ))}
    </colgroup>
  )

  const head = (
    <thead className="at-table__thead" ref={headerRef}>
      <tr>
        {optional && (
          <th className="at-table__cell at-table__column-selection">
            <Checkbox value={isSelectAll} onChange={handleSelectAll} />
          </th>
        )}
        {columns.map((column, i) => {
          const order = sort.index === i ? sort.order : 'normal'
          return (
            <th
              key={column.key || i}
              className={classNames('at-table__cell', 'at-table__column', column.className)}
              style={{ cursor: column.sortType ? 'pointer' : 'text' }}
              onClick={() => column.sortType && handleSort(i)}
            >
              {column.title}
              {column.sortType && (
                <div
                  className={classNames('at-table__column-sorter', {
                    'sort-asc': order === 'asc',
                    'sort-desc': order === 'desc'
                  })}
                >
                  <span
                    className="at-table__column-sorter-up"
                    onClick={(evt) => {
                      evt.stopPropagation()
                      handleSort(i, 'asc')
                    }}
                  >
                    <i className="icon icon-chevron-up" />
                  </span>
                  <span
                    className="at-table__column-sorter-down"
                    onClick={(evt) => {
                      evt.stopPropagation()
                      handleSort(i, 'desc')
                    }}
                  >
                    <i className="icon icon-chevron-down" />
                  </span>
                </div>
              )}
            </th>
          )
        })}
      </tr>
    </thead>
  )

  const hasFixedHeader = !!height

  const tableStyle = { ...style }
  if (height) tableStyle.height = `${height}px`
  if (width) tableStyle.width = `${width}px`

  const bodyStyle = layout.bodyHeight
    ? { height: `${layout.bodyHeight}px`, marginTop: `${layout.headerHeight}px` }
    : undefined
  const contentStyle = layout.bodyHeight
    ? { height: `${layout.bodyHeight + layout.headerHeight}px` }
    : undefined

  return (
    <div
      className={classNames(
        'at-table',
        {
          'at-table--fixHeight': hasFixedHeader,
          'at-table--stripe': stripe,
          [`at-table--${size}`]: size,
          'at-table--border': border
        },
        className
      )}
      style={tableStyle}
      {...restProps}
    >
      <div className="at-table__content" style={contentStyle}>
        {hasFixedHeader && (
          <div className="at-table__header">
            <table>
              {colgroup}
              {head}
            </table>
          </div>
        )}

        <div className="at-table__body" style={bodyStyle} ref={bodyRef}>
          <table>
            {colgroup}
            {!hasFixedHeader && head}
            <tbody className="at-table__tbody">
              {pageRows.length ? (
                pageRows.map(({ row, index }, rowIndex) => (
                  <tr key={index}>
                    {optional && (
                      <td className="at-table__cell at-table__column-selection">
                        <Checkbox
                          value={selected.has(index)}
                          onChange={(checked) => handleSelectRow(index, checked)}
                        />
                      </td>
                    )}
                    {columns.map((column, i) => (
                      <td key={column.key || i} className="at-table__cell">
                        {column.render
                          ? column.render(row, { index: rowIndex, column })
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="at-table__cell at-table__cell--nodata"
                    colSpan={optional ? columns.length + 1 : columns.length}
                  >
                    {emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && total > 0 && (
        <div className="at-table__footer" ref={footerRef}>
          <Pagination
            current={currentPage}
            size={size === 'normal' ? undefined : size}
            total={total}
            pageSize={pageSize}
            showTotal={showPageTotal}
            showSizer={showPageSizer}
            showQuickjump={showPageQuickjump}
            onChange={(next) => {
              setPage(next)
              if (onPageChange) onPageChange(next)
            }}
            onPageSizeChange={(next) => {
              setPageSize(next)
              setPage(1)
              if (onPageSizeChange) onPageSizeChange(next)
            }}
          />
        </div>
      )}
    </div>
  )
}

Table.displayName = 'AtTable'

export default Table
