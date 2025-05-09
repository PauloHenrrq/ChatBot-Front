import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProcessoCandidatura () {
  const { id } = useParams()

  return (
    <>
      <div>ProcessoCandidatura: {id}</div>
    </>
  )
}
