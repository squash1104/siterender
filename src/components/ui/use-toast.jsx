import * as React from "react"

const toastTimeouts = new Map()

export const useToast = () => {
  const [toasts, setToasts] = React.useState([])

  const addToast = React.useCallback(({ title, description, ...props }) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, title, description, ...props }])

    if (props.duration) {
      const timeout = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, props.duration)
      toastTimeouts.set(id, timeout)
    }

    return id
  }, [])

  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    if (toastTimeouts.has(id)) {
      clearTimeout(toastTimeouts.get(id))
      toastTimeouts.delete(id)
    }
  }, [])

  return { toasts, addToast, dismiss }
}