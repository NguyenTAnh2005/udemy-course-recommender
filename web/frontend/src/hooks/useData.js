// src/hooks/useData.js
import { useEffect, useState } from 'react'

const FILES = ['summary', 'clusters', 'breakdown', 'points', 'courses']

export default function useData() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all(
      FILES.map(f =>
        fetch(`/data/${f}.json`).then(r => {
          if (!r.ok) throw new Error(`${f}.json: ${r.status}`)
          return r.json()
        })
      )
    )
      .then(res => {
        const d = Object.fromEntries(FILES.map((f, i) => [f, res[i]]))
        setData(d)
      })
      .catch(setError)
  }, [])

  return { data, error }
}