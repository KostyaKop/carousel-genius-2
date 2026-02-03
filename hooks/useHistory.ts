import { useCallback, useRef, useState } from 'react'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  })

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const update = useCallback(
    (newState: T, commit: boolean = true) => {
      if (commit) {
        // Immediate commit: push current to past, set new as present, clear future
        setState((prev) => ({
          past: [...prev.past, prev.present],
          present: newState,
          future: [],
        }))
      } else {
        // In-place update (no history): just update present without changing past/future
        setState((prev) => ({
          ...prev,
          present: newState,
        }))
      }
    },
    []
  )

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.past.length === 0) return prev
      const previous = prev.past[prev.past.length - 1]
      const newPast = prev.past.slice(0, prev.past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.future.length === 0) return prev
      const next = prev.future[0]
      const newFuture = prev.future.slice(1)
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      }
    })
  }, [])

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  return {
    state: state.present,
    update,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
