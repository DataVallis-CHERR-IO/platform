import React from 'react'
import { useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import { dataTableOptions } from '../../../config'

interface IDataTableProps {
  columns: any[]
  rows: any[]
}

const DataTable = ({ columns, rows }: IDataTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(dataTableOptions.rowsPerPage)

  const handleOnChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleOnChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(
                column =>
                  !column.ignore && (
                    <TableCell key={column.id} align={column.align} style={{ width: column.width }}>
                      {column.label}
                    </TableCell>
                  )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {columns.map(column => {
                    return (
                      !column.ignore && (
                        <TableCell key={column.id} align={column.align}>
                          {row[column.id]}
                        </TableCell>
                      )
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={dataTableOptions.rowsPerPageOptions}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        className='table-p-remove-styles'
        onPageChange={handleOnChangePage}
        onRowsPerPageChange={handleOnChangeRowsPerPage}
      />
    </Paper>
  )
}

export default DataTable
