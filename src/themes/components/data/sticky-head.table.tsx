import { useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'

interface IStickyHeadTable {
  columns: any[]
  rows: any[]
}

const StickyHeadTable = ({ columns, rows }: IStickyHeadTable) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    console.log(event)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        className='table-p-remove-styles'
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default StickyHeadTable
