import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    console.log('[App] effect running')
    fetch('/api/ping')
      .then(res => {
        console.log('[App] fetch status:', res.status)
        return res.json()
      })
      .then(data => {
        console.log('[App] fetch data:', data)
        setMsg(data.message ?? '(no message field)')
      })
      .catch(err => {
        console.error('[App] fetch error:', err)
        setMsg('Error fetching ping')
      })
  }, [])

  console.log('[App] render msg=', msg)

  return (
    <div>
      <h1>Backend says: {msg}</h1>
    </div>
  );
}

export default App