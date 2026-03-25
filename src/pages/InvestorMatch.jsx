import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, Modal, Input, Field } from '../components/ui'

const STATUS_CONFIG = {
  outreach_sent:  { label: 'Outreach Sent',  cls: 'tag-gray'   },
  interested:     { label: 'Interested',      cls: 'tag-blue'   },
  in_discussion:  { label: 'In Discussion',   cls: 'tag-amber'  },
  term_sheet:     { label: 'Term Sheet 🎉',   cls: 'tag-teal'   },
  closed:         { label: 'Closed ✓',        cls: 'tag-green'  },
  rejected:       { label: 'Rejected',        cls: 'tag-coral'  },
}

const fitColor = f => f >= 85 ? 'var(--green)' : f >= 70 ? 'var(--acc)' : f >= 55 ? 'var(--amber)' : 'var(--coral)'

export default function InvestorMatch() {
  const { user } = useAuth()
  const startups   = DB.getStartupsForUser(user.id)
  const investors  = DB.getInvestors()

  const [selId, setSelId]       = useState(startups[0]?.id || null)
  const [pipeline, setPipeline] = useState(selId ? DB.getPipeline(selId) : [])
  const [showAdd, setShowAdd]   = useState(false)
  const [addForm, setAddForm]   = useState({ investorId: '', note: '' })

  useEffect(() => {
    if (selId) setPipeline(DB.getPipeline(selId))
  }, [selId])

  const refresh = () => setPipeline(DB.getPipeline(selId))

  const addToPipeline = () => {
    if (!addForm.investorId || !selId) return
    DB.addToPipeline(selId, addForm.investorId, addForm.note)
    refresh()
    setShowAdd(false)
    setAddForm({ investorId: '', note: '' })
  }

  const updateStatus = (invId, status) => {
    DB.updatePipeline(selId, invId, { status })
    refresh()
  }

  const remove = invId => {
    if (!confirm('Remove from pipeline?')) return
    DB.removeFromPipeline(selId, invId)
    refresh()
  }

  const startup     = DB.getStartup(selId)
  const available   = investors.filter(i => !pipeline.some(p => p.investorId === i.id))
  const suggested   = [...available].sort((a, b) => (b.fit?.[user.id] || 70) - (a.fit?.[user.id] || 70)).slice(0, 5)

  return (
    <Shell title="Investor Match" subtitle="Track your fundraising pipeline">
      <div className="content-grid">
        {/* Startup selector tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif'" }}>
            Select startup
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {startups.map(s => (
              <button key={s.id} onClick={() => setSelId(s.id)} style={{
                fontSize: '11px', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer',
                border: `.5px solid ${selId === s.id ? 'var(--acc)' : 'rgba(255,255,255,.13)'}`,
                color: selId === s.id ? 'var(--acc)' : 'var(--muted)',
                background: selId === s.id ? 'rgba(91,127,255,.08)' : 'transparent',
                fontFamily: "'DM Sans',sans-serif", transition: 'all .15s',
              }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {!selId ? (
          <Card style={{ textAlign: 'center', padding: '32px', color: 'var(--muted)' }}>
            No startups found. <a href="/my-startups" style={{ color: 'var(--acc)' }}>Create one first</a>.
          </Card>
        ) : (
          <>
            {/* Startup summary */}
            {startup && (
              <Card>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: 700 }}>{startup.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{startup.desc || startup.tagline}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <Tag text={startup.stage} cls={startup.stageClass || 'tag-gray'} />
                    <Tag text={`Target: ${startup.fundingTarget || '—'}`} cls="tag-green" />
                    <Tag text={`Raised: ${startup.fundingRaised || '₹0'}`} cls="tag-amber" />
                  </div>
                </div>
              </Card>
            )}

            {/* Pipeline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif'" }}>
                {pipeline.length} investor{pipeline.length !== 1 ? 's' : ''} in pipeline
              </span>
              <Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}>
                <Ico name="plus" size={12} /> Add Investor
              </Btn>
            </div>

            {pipeline.length === 0 ? (
              <Card style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                No investors added yet. Start building your fundraising pipeline!
              </Card>
            ) : (
              <div className="page-section">
                {pipeline.map(m => {
                  const inv = investors.find(i => i.id === m.investorId)
                  if (!inv) return null
                  const fit = inv.fit?.[user.id] || 70
                  const sc  = STATUS_CONFIG[m.status] || { label: m.status, cls: 'tag-gray' }
                  return (
                    <Card key={m.investorId}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Avatar initials={inv.initials} avClass={inv.avClass} />
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', fontWeight: 700 }}>{inv.name}</span>
                            <Tag text={sc.label} cls={sc.cls} />
                            <Tag text={`${fit}% fit`} cls="tag-blue" />
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>{inv.focus} · {inv.stage}</div>
                          {m.note && <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '8px' }}>{m.note}</div>}
                          {/* Status buttons */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                              <button key={k} onClick={() => updateStatus(m.investorId, k)} style={{
                                fontSize: '10px', padding: '3px 8px', borderRadius: '20px', cursor: 'pointer',
                                border: `.5px solid ${m.status === k ? 'var(--acc)' : 'rgba(255,255,255,.13)'}`,
                                color: m.status === k ? 'var(--acc)' : 'var(--muted)',
                                background: m.status === k ? 'rgba(91,127,255,.1)' : 'transparent',
                                fontFamily: "'DM Sans',sans-serif", transition: 'all .15s',
                              }}>
                                {v.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: 800, color: fitColor(fit) }}>{fit}%</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.date}</div>
                          <Btn size="sm" variant="danger" onClick={() => remove(m.investorId)} style={{ padding: '3px 8px' }}>
                            <Ico name="trash" size={11} /> Remove
                          </Btn>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Suggested investors */}
            {suggested.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Suggested investors for {startup?.name}</CardTitle>
                  <Tag text={`${suggested.length} suggestions`} cls="tag-teal" />
                </CardHeader>
                <div className="page-section">
                  {suggested.map(inv => {
                    const fit = inv.fit?.[user.id] || 70
                    return (
                      <div key={inv.id} style={{
                        background: 'var(--surface)', border: '.5px solid var(--border)',
                        borderRadius: '10px', padding: '11px', display: 'flex',
                        alignItems: 'center', gap: '10px',
                      }}>
                        <Avatar initials={inv.initials} avClass={inv.avClass} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>{inv.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{inv.focus} · {inv.stage}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: 800, color: fitColor(fit) }}>{fit}%</div>
                          <Btn variant="primary" size="sm" onClick={() => {
                            DB.addToPipeline(selId, inv.id, `Targeting ${inv.name} for ${startup?.fundingTarget || 'fundraise'}.`)
                            refresh()
                          }}>
                            Add to pipeline
                          </Btn>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Add investor modal */}
      {showAdd && (
        <Modal title="Add Investor to Pipeline" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Field label="Select Investor *">
              <select
                value={addForm.investorId}
                onChange={e => setAddForm(f => ({ ...f, investorId: e.target.value }))}
                style={{
                  background: 'var(--surface)', border: '.5px solid var(--border2)',
                  borderRadius: '8px', padding: '8px 11px', color: 'var(--text)',
                  fontSize: '13px', fontFamily: "'DM Sans',sans-serif", outline: 'none', width: '100%',
                }}
              >
                <option value="">-- Select investor --</option>
                {available
                  .sort((a, b) => (b.fit?.[user.id] || 70) - (a.fit?.[user.id] || 70))
                  .map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.fit?.[user.id] || 70}% fit)
                    </option>
                  ))}
              </select>
            </Field>
            <Field label="Note / Context">
              <Input
                value={addForm.note}
                onChange={e => setAddForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Why this investor? Mutual connections, specific fit, approach strategy..."
                multiline
                rows={3}
              />
            </Field>
            <Btn variant="primary" full onClick={addToPipeline}>Add to Pipeline</Btn>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
