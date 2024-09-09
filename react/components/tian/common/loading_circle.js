//** 麵包屑導覽 */

import React from 'react'

import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

export default function Loading_Circle() {
  return (
    <>
      <Stack
        sx={{ color: '#413c1c', position: 'absolute', top: '50%', left: '50%' }}
        spacing={2}
        direction="row"
      >
        <CircularProgress color="inherit" />
      </Stack>
    </>
  )
}
