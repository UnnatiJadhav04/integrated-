import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addEmails, getEmails } from '../api'
import { useAuth } from '../AuthContext'

export default function AddMail() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [emails, setEmails] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) { navigate('/add-mail'); return }
    getEmails(userId)
      .then((data) => setEmails(data))
      .catch(() => setEmails([]))
      .finally(() => setFetching(false))
  }, [userId])

  const handleAdd = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setError('')
    // Optimistically add
    const draft = { email_address: trimmed, is_active: true, is_verified: false, _pending: true }
    setEmails((prev) => [...prev, draft])
    setInput('')
    setLoading(true)
    try {
      await addEmails(userId, [trimmed])
      // Refresh from server
      const fresh = await getEmails(userId)
      setEmails(fresh)
    } catch (e) {
      setError(e.message)
      setEmails((prev) => prev.filter((em) => !em._pending))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (email_address) =>
    setEmails(emails.filter((e) => e.email_address !== email_address))

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 flex justify-between items-center w-full px-6 h-16">

<Link to="/">
  <div className="text-lg font-medium text-black">
    InboxGuardian
  </div>
</Link>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 transition-colors rounded-full">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 text-base">person</span>
          </div>
        </div>
      </header>

      <main className="pt-24 min-h-screen flex flex-col items-center px-gutter">
        <div className="w-full max-w-2xl">
          <div className="mb-xl text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-fixed mb-md">
              <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
            </div>
            <h1 className="text-h2 font-semibold text-on-surface mb-xs">Which emails should we monitor?</h1>
            <p className="text-body-lg text-secondary">Add the email addresses you want to receive alerts for.</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
          )}

          <div className="space-y-md">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
              <div className="flex flex-col gap-sm">
                <label className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider">Email Address</label>
                <div className="flex gap-md">
                  <div className="relative flex-grow">
                    <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">mail</span>
                    <input
                      type="email"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                      placeholder="e.g. alex@company.com"
                      className="w-full pl-11 pr-md py-3 bg-surface-bright border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary transition-all outline-none text-body-md"
                    />
                  </div>
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary text-label-md font-medium px-lg py-3 rounded-lg transition-transform active:scale-95 flex items-center gap-xs shadow-md disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    {loading ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-sm">
              <h3 className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wider px-xs">Monitoring List ({emails.length})</h3>
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl divide-y divide-outline-variant overflow-hidden">
                {emails.length === 0 && (
                  <div className="p-md text-center text-on-surface-variant text-body-sm">No emails added yet.</div>
                )}
                {emails.map((e, i) => (
                  <div key={i} className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors group">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-fixed text-primary">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>alternate_email</span>
                      </div>
                      <div>
                        <p className="text-label-md font-medium text-on-surface">{e.email_address}</p>
                        <p className="text-body-sm text-secondary flex items-center gap-1">
                          {e.is_verified
                            ? <><span className="material-symbols-outlined text-sm text-green-600">verified</span> Verified</>
                            : e._pending
                              ? 'Saving...'
                              : 'Pending verification'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(e.email_address)} className="p-2 text-outline hover:text-error hover:bg-error-container rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-lg flex flex-col sm:flex-row items-center justify-between gap-md border-t border-outline-variant pt-xl">
            <div className="flex items-center gap-sm text-secondary">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <span className="text-body-sm">Your data is encrypted end-to-end</span>
            </div>
            <div className="flex gap-md w-full sm:w-auto">
              <Link to="/add-keywords" className="flex-1 sm:flex-none px-xl py-3 border border-outline-variant text-label-md font-medium text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-colors text-center">
                Skip for now
              </Link>
              <Link to="/add-keywords" className="flex-1 sm:flex-none px-2xl py-3 bg-primary hover:bg-on-primary-fixed-variant text-on-primary text-label-md font-medium rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-sm">
                Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        <footer className="mt-2xl py-lg text-center w-full max-w-2xl">
          <div className="flex justify-center gap-base mb-sm">
            {[false, true, false, false].map((active, i) => (
              <div key={i} className={`w-8 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-outline-variant'}`}></div>
            ))}
          </div>
          <p className="text-label-sm text-outline">Step 2 of 4: Identity Mapping</p>
        </footer>
      </main>
    </div>
  )
}
