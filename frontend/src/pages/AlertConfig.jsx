import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Toggle from '../components/Toggle'
import { saveAlertConfig } from '../api'
import { useAuth } from '../AuthContext'

const URGENCY_LEVELS = ['low', 'medium', 'high']

export default function AlertConfig() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [push, setPush] = useState(true)
  const [emailAlert, setEmailAlert] = useState(false)
  const [whatsapp, setWhatsapp] = useState(false)
  const [sms, setSms] = useState(false)
  const [urgency, setUrgency] = useState(1) // index 0=low,1=medium,2=high
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFinish = async () => {
    if (!userId) { navigate('/login'); return }
    setError('')
    setLoading(true)
    try {
      await saveAlertConfig(userId, [{
        email_alert: emailAlert,
        push_notification: push,
        whatsapp_alert: whatsapp,
        sms_alert: sms,
        urgency_level: URGENCY_LEVELS[urgency],
      }])
      navigate('/add-passkey')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background text-on-background font-sans min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-12 px-6 flex justify-center items-start">
        <div className="max-w-2xl w-full">
          <div className="mb-lg flex items-center gap-xs text-on-surface-variant text-label-sm font-semibold">
            <span>Setup Guide</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary font-semibold">Step 3 of 4</span>
          </div>

          <div className="mb-xl">
            <h1 className="text-h1 font-bold text-on-surface mb-xs">How should we alert you?</h1>
            <p className="text-on-surface-variant text-body-lg">Select your preferred channels and alert frequency.</p>
          </div>

          {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-xl">
            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-md">
                <div className="bg-primary-fixed p-sm rounded-lg text-primary">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <Toggle checked={push} onChange={() => setPush(!push)} />
              </div>
              <h3 className="text-h3 font-semibold mb-xs">Push notifications</h3>
              <p className="text-body-sm text-on-surface-variant">Real-time alerts directly on your desktop or mobile device.</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-md">
                <div className="bg-surface-variant p-sm rounded-lg text-on-surface-variant">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <Toggle checked={emailAlert} onChange={() => setEmailAlert(!emailAlert)} />
              </div>
              <h3 className="text-h3 font-semibold mb-xs">Email alerts</h3>
              <p className="text-body-sm text-on-surface-variant">Detailed reports and threat analysis sent to your inbox.</p>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:border-primary transition-colors col-span-1 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg">
                <div className="flex gap-md items-start">
                  <div className="bg-tertiary-fixed p-sm rounded-lg text-on-tertiary-fixed">
                    <span className="material-symbols-outlined">chat</span>
                  </div>
                  <div>
                    <h3 className="text-h3 font-semibold mb-xs">WhatsApp alerts</h3>
                    <p className="text-body-sm text-on-surface-variant">Receive security pins and urgent alerts via WhatsApp.</p>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99999 99999"
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-md py-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-sm"
                  />
                  <Toggle checked={whatsapp} onChange={() => setWhatsapp(!whatsapp)} />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-sm hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-md">
                <div className="bg-surface-variant p-sm rounded-lg text-on-surface-variant">
                  <span className="material-symbols-outlined">sms</span>
                </div>
                <Toggle checked={sms} onChange={() => setSms(!sms)} />
              </div>
              <h3 className="text-h3 font-semibold mb-xs">SMS alerts</h3>
              <p className="text-body-sm text-on-surface-variant">Direct text messages for critical account changes.</p>
            </div>

            <div className="bg-primary-fixed text-on-primary-fixed p-lg rounded-xl shadow-sm flex flex-col justify-center">
              <div className="mb-md">
                <h3 className="text-h3 font-semibold mb-xs">Urgency level</h3>
                <p className="text-body-sm opacity-80">How often should we interrupt you?</p>
              </div>
              <div className="relative w-full pt-md pb-xs">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={urgency}
                  onChange={(e) => setUrgency(Number(e.target.value))}
                  className="w-full h-1.5 bg-on-primary-fixed/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-sm text-label-sm uppercase tracking-wider opacity-90">
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-lg bg-surface-container-high p-lg rounded-xl">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
              <div>
                <p className="text-label-md font-medium text-on-surface">Settings Auto-Save</p>
                <p className="text-body-sm text-on-surface-variant">Changes are applied immediately to your profile.</p>
              </div>
            </div>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full md:w-auto bg-primary text-on-primary text-md font-bold px-10 py-4 rounded-lg shadow-lg hover:bg-on-primary-fixed-variant active:scale-95 transition-all text-center disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Finish Setup'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
