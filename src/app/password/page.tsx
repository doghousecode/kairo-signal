'use client'

import { useState, FormEvent } from 'react'

export default function PasswordPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      window.location.replace('/')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          background: #0d0d0d;
          min-height: 100vh;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0d0d0d;
          padding: 2rem;
        }

        .wordmark {
          width: min(54vw, 320px);
          height: auto;
          margin-bottom: 3rem;
          opacity: 0;
          animation: fadeIn 0.8s ease forwards 0.1s;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
          max-width: 320px;
          opacity: 0;
          animation: fadeIn 0.8s ease forwards 0.3s;
        }

        input[type="password"] {
          width: 100%;
          background: #161616;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 8px;
          color: #f0f0f0;
          font-size: 1rem;
          letter-spacing: 0.08em;
          padding: 0.75rem 1rem;
          outline: none;
          text-align: center;
          transition: border-color 0.2s;
          -webkit-font-smoothing: antialiased;
        }

        input[type="password"]::placeholder {
          color: rgba(240,240,240,0.2);
          letter-spacing: 0.04em;
        }

        input[type="password"]:focus {
          border-color: rgba(91,128,232,0.5);
        }

        button[type="submit"] {
          width: 100%;
          background: #5a7de8;
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 0.75rem 1rem;
          transition: background 0.2s, opacity 0.2s;
          -webkit-font-smoothing: antialiased;
        }

        button[type="submit"]:hover:not(:disabled) {
          background: #6b8ef5;
        }

        button[type="submit"]:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .error {
          color: rgba(240,100,100,0.85);
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="page">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kairo-wordmark-cropped.png" alt="Kairo" className="wordmark" />

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !password}>
            {loading ? 'checking…' : 'enter'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </>
  )
}
