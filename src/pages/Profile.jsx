import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, ScoreRing, Input, Field, Select, useToast, Toast } from '../components/ui'

const STAGES = ['Ideation', 'MVP', 'Beta', 'Seed', 'Series A']

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const { toast, show } = useToast()

  const analytics = DB.getAnalytics(user.id)

  const [form, setForm] = useState({
    name:       user.name,
    email:      user.email,
    role:       user.role,
    city:       user.city,
    bio:        user.bio || '',
    skills:     (user.skills || []).join(', '),
    lookingFor: (user.lookingFor || []).join(', '),
    stage:      user.stage || 'MVP',
    linkedIn:   user.linkedIn || '',
    github:     user.github || '',
    twitter:    user.twitter || '',
    website:    user.website || '',
  })

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = () => {
    updateUser({
      ...form,
      skills:     form.skills.split(',').map(s => s.trim()).filter(Boolean),
      lookingFor: form.lookingFor.split(',').map(s => s.trim()).filter(Boolean),
    })
    show('Profile saved!')
  }

  /* Live "needs file" preview */
  const needsPreview = () => {
    const skills    = form.skills.split(',').map(s => s.trim()).filter(Boolean)
    const lookingFor = form.lookingFor.split(',').map(s => s.trim()).filter(Boolean)
    return (
      <>
        <strong style={{ color: 'var(--text)' }}>{form.name}</strong> is a{' '}
        <em>{form.role}</em> based in {form.city}, currently at{' '}
        <strong style={{ color: 'var(--acc)' }}>{form.stage}</strong> stage.
        <br /><br />
        They bring expertise in{' '}
        <strong style={{ color: 'var(--text)' }}>
          {skills.slice(0, 4).join(', ') || 'not specified'}
        </strong>{' '}
        and are actively looking for a co-founder with skills in:{' '}
        <strong style={{ color: 'var(--acc)' }}>
          {lookingFor.join(', ') || 'update your profile to specify'}
        </strong>.
        <br /><br />
        Match algorithm will prioritise candidates who complement these gaps.
      </>
    )
  }

  return (
    <Shell title="My Profile" subtitle="Update your co-founder profile and needs">
      <Toast toast={toast} />

      {/* Profile header */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(91,127,255,.09),rgba(167,139,250,.05))',
        border: '.5px solid rgba(91,127,255,.22)', borderRadius: '14px', padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
        animation: 'fadeUp .4s ease both',
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
          <Avatar initials={user.initials} avClass={user.avClass} size="xl" />
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: 800, marginBottom: '3px' }}>{form.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '7px' }}>{form.role} · {form.city}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {form.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4).map(s => (
                <Tag key={s} text={s} cls="tag-gray" />
              ))}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--acc)' }}>
            {analytics.profileScore}%
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px' }}>
            profile score
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Profile header */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(91,127,255,.09),rgba(167,139,250,.05))',
          border: '.5px solid rgba(91,127,255,.22)', borderRadius: '14px', padding: '18px 22px',
          display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '16px', alignItems: 'center', flexWrap: 'wrap',
          animation: 'fadeUp .4s ease both',
        }}>
          <Avatar initials={user.initials} avClass={user.avClass} size="xl" />
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: 800, marginBottom: '3px' }}>{form.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '7px' }}>{form.role} · {form.city}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {form.skills.split(',').map(s => s.trim()).filter(Boolean).slice(0, 4).map(s => (
                <Tag key={s} text={s} cls="tag-gray" />
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '32px', fontWeight: 800, color: 'var(--acc)' }}>
              {analytics.profileScore}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px' }}>
              profile score
            </div>
          </div>
        </div>

        <div className="page-section-2col">
          {/* LEFT — Basic info */}
          <div className="page-section">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <div className="grid-cols-2 gap-12">
                <Field label="Full Name">
                  <Input value={form.name} onChange={set('name')} placeholder="Your full name" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
                </Field>
                <Field label="Role / Title">
                  <Input value={form.role} onChange={set('role')} placeholder="e.g. Product Builder" />
                </Field>
                <Field label="City">
                  <Input value={form.city} onChange={set('city')} placeholder="e.g. Chennai" />
                </Field>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Bio">
                    <Input value={form.bio} onChange={set('bio')} placeholder="2–3 lines about your background, what you're building, and what you're looking for in a co-founder." multiline rows={4} />
                  </Field>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader><CardTitle>Social & Links</CardTitle></CardHeader>
              <div className="grid-cols-2 gap-12">
                <Field label="LinkedIn">
                  <Input value={form.linkedIn} onChange={set('linkedIn')} placeholder="https://linkedin.com/in/..." />
                </Field>
                <Field label="GitHub">
                  <Input value={form.github} onChange={set('github')} placeholder="https://github.com/..." />
                </Field>
                <Field label="Twitter / X">
                  <Input value={form.twitter} onChange={set('twitter')} placeholder="https://twitter.com/..." />
                </Field>
                <Field label="Personal Website">
                  <Input value={form.website} onChange={set('website')} placeholder="https://yoursite.com" />
                </Field>
              </div>
            </Card>
          </div>

          {/* RIGHT — Needs + Account */}
          <div className="page-section">
            <Card>
              <CardHeader><CardTitle>Co-founder Needs</CardTitle></CardHeader>
              <div className="page-section">
                <Field label="My Skills (comma-separated)">
                  <Input value={form.skills} onChange={set('skills')} placeholder="e.g. Product Management, B2B SaaS, Strategy" />
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>Used for matching and skill search.</div>
                </Field>

                <Field label="Looking for (comma-separated roles)">
                  <Input value={form.lookingFor} onChange={set('lookingFor')} placeholder="e.g. Tech CTO, Growth Marketer, AI Engineer" />
                </Field>

                <Field label="Startup Stage">
                  <Select value={form.stage} onChange={set('stage')} options={STAGES} />
                </Field>

                {/* Needs File Preview */}
                <div style={{
                  background: 'var(--surface)', border: '.5px solid var(--border2)',
                  borderRadius: '10px', padding: '13px',
                }}>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif", marginBottom: '8px' }}>
                    📋 Your Co-founder Needs File
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>
                    {needsPreview()}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '8px', opacity: .6 }}>
                    This is what co-founders see when they view your profile.
                  </div>
                </div>

                <Btn variant="primary" full onClick={save} style={{ padding: '10px' }}>
                  <Ico name="check" size={13} /> Save Profile
                </Btn>
              </div>
            </Card>

            {/* Account info */}
            <Card>
              <CardHeader><CardTitle>Account</CardTitle></CardHeader>
              <div className="page-section">
                {[
                  ['Email', user.email],
                  ['Theme', <span style={{ color: 'var(--acc)', textTransform: 'capitalize' }}>{user.theme || 'blue'}</span>],
                  ['Member since', 'January 2026'],
                  ['Login days (March)', <span style={{ color: 'var(--green)' }}>{(user.loginHistory || []).length}</span>],
                  ['Profile score', <span style={{ color: 'var(--acc)' }}>{analytics.profileScore}%</span>],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '.5px solid var(--border)' }}>
                    <span style={{ color: 'var(--muted)' }}>{l}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <Btn variant="danger" full onClick={logout}>Sign Out</Btn>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}
