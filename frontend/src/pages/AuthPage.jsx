import { useState } from 'react'
import { Gamepad2, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import { useAuth } from '../lib/auth.jsx'
import { useToast } from '../components/Toast.jsx'
import { pendingError } from '../lib/api'
import { Button, Input, Select, Field } from '../components/ui.jsx'
import { MESTA } from '../lib/constants'

const FEATURES = [
  { icon: Zap, title: 'Brzo iznajmljivanje', text: 'Korpa, klijent i potvrda u par klikova.' },
  { icon: ShieldCheck, title: 'Sigurna prijava', text: 'JWT autentikacija po ulogama.' },
  { icon: Sparkles, title: 'Pregled inventara', text: 'Stanje svake konzole u realnom vremenu.' },
]

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'

  return (
    <div className="flex min-h-screen bg-surface-muted">
      {/* Leva strana — brend / marketing (Apple-style hero) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 10%, rgba(0,113,227,0.45), transparent 60%), radial-gradient(50% 50% at 90% 90%, rgba(88,86,214,0.4), transparent 60%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Gamepad2 className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Konzola</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">
            Iznajmljivanje konzola, <br /> bez komplikacija.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Upravljaj inventarom, klijentima i iznajmljivanjima sa jednog mesta — čisto,
            brzo i pregledno.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                  <f.icon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-[13px] text-white/60">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[13px] text-white/40">
          © {new Date().getFullYear()} Konzola — Iznajmljivanje konzola
        </p>
      </div>

      {/* Desna strana — forma */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          {/* Brend na mobilnom */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-ink">Konzola</span>
          </div>

          {/* Prebacivanje login / register */}
          <div className="mb-7 inline-flex rounded-2xl bg-surface-muted p-1">
            <TabButton active={mode === 'login'} onClick={() => setMode('login')}>
              Prijava
            </TabButton>
            <TabButton active={mode === 'register'} onClick={() => setMode('register')}>
              Registracija
            </TabButton>
          </div>

          {mode === 'login' ? <LoginForm /> : <RegisterForm onDone={() => setMode('login')} />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-xl px-5 py-2 text-sm font-medium transition ' +
        (active ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink')
      }
    >
      {children}
    </button>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ korisnickoIme: '', lozinka: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form.korisnickoIme.trim(), form.lozinka)
      toast.success(`Dobrodošli! Prijavljeni ste kao ${res.uloga || 'korisnik'}.`)
    } catch (err) {
      toast.error(pendingError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Prijavi se</h2>
        <p className="mt-1 text-sm text-ink-soft">Unesi korisničko ime i lozinku.</p>
      </div>

      <Field label="Korisničko ime">
        <Input
          autoFocus
          placeholder="npr. admin"
          value={form.korisnickoIme}
          onChange={(e) => setForm({ ...form, korisnickoIme: e.target.value })}
          required
        />
      </Field>
      <Field label="Lozinka">
        <Input
          type="password"
          placeholder="••••••••"
          value={form.lozinka}
          onChange={(e) => setForm({ ...form, lozinka: e.target.value })}
          required
        />
      </Field>

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Prijavi se
      </Button>

      <p className="rounded-xl bg-surface-muted px-3.5 py-2.5 text-[12.5px] text-ink-soft">
        Demo radnik: <span className="font-medium text-ink">admin</span> /{' '}
        <span className="font-medium text-ink">Admin123!</span>
      </p>
    </form>
  )
}

function RegisterForm({ onDone }) {
  const { register } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
    lozinka: '',
    mestoId: MESTA[0].id,
  })
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register({
        ime: form.ime.trim(),
        prezime: form.prezime.trim(),
        email: form.email.trim(),
        telefon: form.telefon.trim(),
        lozinka: form.lozinka,
        mestoId: Number(form.mestoId),
      })
      toast.success('Nalog je kreiran. Dobrodošli!')
    } catch (err) {
      toast.error(pendingError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 animate-fade-in">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Napravi nalog</h2>
        <p className="mt-1 text-sm text-ink-soft">Registruj se kao klijent i prijava je gotova.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Ime">
          <Input autoFocus value={form.ime} onChange={set('ime')} required />
        </Field>
        <Field label="Prezime">
          <Input value={form.prezime} onChange={set('prezime')} required />
        </Field>
      </div>

      <Field label="Email">
        <Input type="email" placeholder="ime@primer.com" value={form.email} onChange={set('email')} required />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Telefon">
          <Input placeholder="+3816..." value={form.telefon} onChange={set('telefon')} required />
        </Field>
        <Field label="Mesto">
          <Select value={form.mestoId} onChange={set('mestoId')}>
            {MESTA.map((m) => (
              <option key={m.id} value={m.id}>
                {m.naziv} ({m.postanskiBroj})
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field label="Lozinka" hint="Najmanje 6 karaktera.">
        <Input
          type="password"
          placeholder="••••••••"
          value={form.lozinka}
          onChange={set('lozinka')}
          minLength={6}
          required
        />
      </Field>

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Registruj se
      </Button>
    </form>
  )
}
