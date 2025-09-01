import React, { useEffect, useRef } from 'react'

interface Props {
  title: string
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  children?: React.ReactNode
}

const Modal: React.FC<Props> = ({
  title,
  open,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg border border-slate-200"
      >
        <h3 id="modal-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h3>
        <div className="mt-3 text-slate-700">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            className="px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-colors"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
