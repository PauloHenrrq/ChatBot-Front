import { useEffect, useRef } from 'react'

export default function FecharModal({ nomeModal, setNomeModal, className, children }) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (nomeModal) {
      const handleClickOutside = event => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          setNomeModal(false)
        }
      }

      const handleEsc = event => {
        if (event.key === 'Escape') {
          setNomeModal(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEsc)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEsc)
      }
    }
  }, [nomeModal, setNomeModal])

  return (
    <div ref={modalRef} className={className}>
      {children}
    </div>
  )
}