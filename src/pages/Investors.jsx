import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, InvestorItem, ScoreRing, ProgressBar, AiTip, Modal, Input, Field, Select } from '../components/ui'

function InvestorDetailModal({ inv, userId, onClose }) {
  const navigate = useNavigate()
  const fit = inv.fit?.[userId] || 70
  const fitColor = fit >= 85 ? 'var(--green)' : fit >= 70 ? 'var(--acc)' : fit >= 55 ? 'var(--amber)' : 'var(--coral)'

  return (
    <Modal title={inv.name} onClose={onClose} large>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Avatar initials={inv.initials} avClass={inv.avClass} size="lg" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: 800, marginBottom: '5px' }}>{inv.name}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            <Tag text={inv.type || 'VC'} cls="tag-purple" />
            <Tag text={inv.stage || '—'} cls="tag-gray" />
            <Tag text={`${fit}% match`} cls="tag-blue" />
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '28px', fontWeight: 800, color: fitColor }}>{fit}%</div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase' }}>fit score</div>
        </div>
      </div>

      <Card style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{inv.description || 'No description.'}</div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <Card>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif" }}>Investment Details</div>
          {[
            ['Focus', inv.focus || '—'],
            ['Stage', inv.stage || '—'],
            ['Ticket Size', inv.ticketSize || '—'],
            ['Portfolio Cos.', inv.investments || 0],
            ['Exits', inv.exits || 0],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '4px 0', borderBottom: '.5px solid var(--border)' }}>
              <span style={{ color: 'var(--muted)' }}>{l}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif" }}>What they look for</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(inv.requirements || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--acc)', flexShrink: 0, marginTop: '5px' }} />
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{r}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {(inv.portfolio || []).length > 0 && (
        <Card style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif" }}>Portfolio Companies</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {inv.portfolio.map(p => <Tag key={p} text={p} cls="tag-gray" />)}
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {inv.website && (
          <a href={inv.website} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px',
            background: 'rgba(255,255,255,.05)', border: '.5px solid rgba(255,255,255,.13)',
            borderRadius: '8px', color: 'var(--text)', fontSize: '12px', textDecoration: 'none'
          }}>
            <Ico name="link" size={12} /> Website
          </a>
        )}
        {inv.contact && (
          <Btn onClick={() => navigator.clipboard?.writeText(inv.contact)}>
            <Ico name="link" size={12} /> Copy Email
          </Btn>
        )}
        <Btn variant="primary" style={{ flex: 1 }} onClick={() => { navigate('/investor-match'); onClose() }}>
          Add to Investor Match Pipeline →
        </Btn>
      </div>
    </Modal>
  )
}

export default function Investors() {
  const { user } = useAuth()
  const [investors, setInvestors] = useState(() => DB.getInvestors())
  const [selInv, setSelInv] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'VC Fund', focus: '', stage: '', ticketSize: '',
    contact: '', website: '', description: '', requirements: ''
  })

  const addInvestor = () => {
    if (!form.name) return
    DB.addInvestor({
      ...form,
      requirements: form.requirements.split(',').map(s => s.trim()).filter(Boolean)
    })
    setInvestors(DB.getInvestors())
    setShowAdd(false)
    setForm({ name: '', type: 'VC Fund', focus: '', stage: '', ticketSize: '', contact: '', website: '', description: '', requirements: '' })
  }

  const sorted = [...investors].sort((a, b) => (b.fit?.[user.id] || 70) - (a.fit?.[user.id] || 70))

  return (
    <Shell title="Investor Radar" subtitle="Find and track the right investors">
      <div className="content-grid">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif'" }}>
            {investors.length} investors
          </span>
          <Btn variant="primary" onClick={() => setShowAdd(true)}>
            <Ico name="plus" size={12} /> Add Investor
          </Btn>
        </div>

        <AiTip>
          <strong>AI analysis:</strong> Based on your profile as a <em>{user.role}</em> in {user.city} at{' '}
          <em>{user.stage || 'MVP'}</em> stage, your best matches are early-stage SaaS/FinTech-focused funds.
          Strengthen traction metrics before approaching Series A investors.
        </AiTip>

        {/* Investor list */}
        <div className="page-section">
          {sorted.map(inv => (
            <InvestorItem key={inv.id} inv={inv} userId={user.id} onClick={() => setSelInv(inv)} />
          ))}
        </div>

        {/* Readiness cards */}
        <div className="page-section-2col">
          <Card>
            <CardHeader><CardTitle>Investor readiness score</CardTitle></CardHeader>
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
              <ScoreRing score={DB.getAnalytics(user.id).profileScore} />
              <div style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <ProgressBar label="Team" value={85} color="var(--green)" />
                <ProgressBar label="Product" value={70} color="var(--acc)" />
                <ProgressBar label="Market" value={65} color="var(--amber)" />
                <ProgressBar label="Traction" value={55} color="var(--coral)" />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>Investor checklist</CardTitle></CardHeader>
            <div className="page-section">
              {[
                [true,  'Complete founder profile'],
                [true,  'Add startup idea with market size'],
                [false, 'Upload pitch deck (PDF)'],
                [false, 'Add 3+ pilot customer references'],
                [false, 'Set fundraising target & use of funds'],
                [false, 'Link to product demo or MVP'],
              ].map(([done, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${done ? 'var(--green)' : 'var(--border2)'}`,
                    background: done ? 'rgba(52,211,153,.15)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {done && (
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5l2.5 2.5 4.5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: done ? 'var(--muted)' : 'var(--text)' }}>{text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selInv && <InvestorDetailModal inv={selInv} userId={user.id} onClose={() => setSelInv(null)} />}

      {showAdd && (
        <Modal title="Add New Investor" onClose={() => setShowAdd(false)} large>
          <div className="grid-cols-2 gap-12">
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Investor / Fund Name *">
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sequoia Capital India" />
              </Field>
            </div>
            <Field label="Type">
              <Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                options={['VC Fund', 'Angel', 'Micro VC', 'Accelerator+Fund', 'Corporate VC']} />
            </Field>
            <Field label="Stage">
              <Input value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} placeholder="e.g. Pre-seed / Seed" />
            </Field>
            <Field label="Focus Areas">
              <Input value={form.focus} onChange={e => setForm(f => ({ ...f, focus: e.target.value }))} placeholder="e.g. SaaS · FinTech · Consumer" />
            </Field>
            <Field label="Ticket Size">
              <Input value={form.ticketSize} onChange={e => setForm(f => ({ ...f, ticketSize: e.target.value }))} placeholder="e.g. ₹50L – ₹5Cr" />
            </Field>
            <Field label="Contact Email">
              <Input type="email" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="pitch@fund.com" />
            </Field>
            <Field label="Website">
              <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://fund.com" />
            </Field>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Description">
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="About this investor..." multiline rows={3} />
              </Field>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <Field label="Requirements (comma-separated)">
                <Input value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="e.g. Validated PMF, ₹1Cr+ ARR, Technical team" />
              </Field>
            </div>
          </div>
          <Btn variant="primary" full style={{ marginTop: '14px' }} onClick={addInvestor}>Add Investor</Btn>
        </Modal>
      )}
    </Shell>
  )
}
