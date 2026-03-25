import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Ico, Avatar, Btn, Input, Label } from '../components/ui'

const DEMO = [
  { e:'siva@fm.in',   p:'siva123',   name:'Siva Ramesh',         role:'Product Builder · Chennai',       av:'SR', ac:'av-blue',   theme:'Blue theme',   stage:'MVP stage' },
  { e:'priya@fm.in',  p:'priya123',  name:'Priya Krishnamurthy', role:'Full-Stack Engineer · Bengaluru', av:'PK', ac:'av-purple', theme:'Purple theme', stage:'Ideation stage' },
  { e:'vikram@fm.in', p:'vikram123', name:'Vikram Kapoor',       role:'Entrepreneur · Hyderabad',        av:'VK', ac:'av-green',  theme:'Green theme',  stage:'Seed stage' },
]

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    city: '',
    skills: ''
  })
  const [err, setErr] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const submit = e => {
    e.preventDefault()
    setErr('')

    if (isRegister) {
      // Registration
      if (!formData.name || !formData.email || !formData.password || !formData.role || !formData.city) {
        setErr('Please fill in all required fields.')
        return
      }

      const skills = formData.skills ? formData.skills.split(',').map(s => s.trim()) : []

      const u = register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        city: formData.city,
        skills: skills
      })

      if (u) {
        navigate('/')
      } else {
        setErr('Email already exists. Please use a different email.')
      }
    } else {
      // Login
      const u = login(formData.email, formData.password)
      if (u) {
        navigate('/')
      } else {
        setErr('Invalid credentials. Use a demo account below.')
      }
    }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'radial-gradient(ellipse at 20% 50%,rgba(91,127,255,.06),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(167,139,250,.05),transparent 50%),var(--bg)',
      padding:'20px', overflowY:'auto',
    }}>
      <div style={{width:'100%',maxWidth:'420px'}}>
        {/* Brand */}
        <div style={{textAlign:'center',marginBottom:'32px'}}>
          <div style={{width:'52px',height:'52px',background:'#5b7fff',borderRadius:'13px',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',boxShadow:'0 8px 32px rgba(91,127,255,.3)'}}>
            <svg width="26" height="26" viewBox="0 0 16 16" fill="none">
              <circle cx="6" cy="5" r="2.5" fill="white"/>
              <circle cx="11" cy="8" r="2" fill="white" opacity=".7"/>
              <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'26px',fontWeight:800,marginBottom:'5px'}}>
            Founder<span style={{color:'#5b7fff'}}>Match</span>
          </div>
          <div style={{fontSize:'13px',color:'var(--muted)'}}>Find your co-founder. Build your startup. Raise your round.</div>
        </div>

        {/* Login/Register Card */}
        <div style={{background:'var(--card)',border:'.5px solid var(--border2)',borderRadius:'16px',padding:'26px',animation:'fadeUp .4s ease both'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'16px',fontWeight:700,marginBottom:'18px'}}>
            {isRegister ? 'Create your account' : 'Sign in to your account'}
          </div>

          {err && (
            <div style={{background:'rgba(251,113,133,.1)',border:'.5px solid rgba(251,113,133,.25)',borderRadius:'8px',padding:'9px 12px',fontSize:'12px',color:'var(--coral)',marginBottom:'12px'}}>
              {err}
            </div>
          )}

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'13px'}}>
            {isRegister && (
              <div>
                <Label>Full Name *</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            )}
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <Label>Password *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            {isRegister && (
              <>
                <div>
                  <Label>Role/Title *</Label>
                  <Input
                    type="text"
                    value={formData.role}
                    onChange={e => handleInputChange('role', e.target.value)}
                    placeholder="e.g. Product Manager, Developer"
                    required
                  />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={e => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Bengaluru, Mumbai"
                    required
                  />
                </div>
                <div>
                  <Label>Skills (optional)</Label>
                  <Input
                    type="text"
                    value={formData.skills}
                    onChange={e => handleInputChange('skills', e.target.value)}
                    placeholder="e.g. React, Python, Marketing"
                  />
                </div>
              </>
            )}
            <Btn type="submit" variant="primary" full style={{padding:'10px',marginTop:'4px'}}>
              {isRegister ? 'Create Account →' : 'Sign In →'}
            </Btn>
          </form>

          <div style={{textAlign:'center',marginTop:'16px'}}>
            <button
              onClick={() => {
                setIsRegister(!isRegister)
                setErr('')
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  role: '',
                  city: '',
                  skills: ''
                })
              }}
              style={{
                background:'none',
                border:'none',
                color:'var(--acc)',
                fontSize:'13px',
                cursor:'pointer',
                textDecoration:'underline'
              }}
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo accounts - only show for login */}
          {!isRegister && (
            <div style={{marginTop:'20px',paddingTop:'16px',borderTop:'.5px solid var(--border)'}}>
              <div style={{fontSize:'10px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif",marginBottom:'9px'}}>
                Demo Accounts — click to fill
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                {DEMO.map(d => (
                  <button key={d.e} onClick={()=>{
                    setFormData(prev => ({ ...prev, email: d.e, password: d.p }))
                    setErr('')
                  }} style={{
                    display:'flex', gap:'10px', alignItems:'center', padding:'9px 12px',
                    background:'var(--surface)', border:'.5px solid var(--border)', borderRadius:'9px',
                    cursor:'pointer', transition:'border-color .15s', width:'100%', color:'var(--text)',
                    fontFamily:"'DM Sans',sans-serif", fontSize:'12px', textAlign:'left',
                  }}>
                    <Avatar initials={d.av} avClass={d.ac} size="sm"/>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,marginBottom:'1px'}}>{d.name}</div>
                      <div style={{fontSize:'10px',color:'var(--muted)'}}>{d.role} · {d.theme}</div>
                    </div>
                    <div style={{fontSize:'10px',color:'var(--muted)',whiteSpace:'nowrap'}}>{d.stage}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
