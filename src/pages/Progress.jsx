import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, MilestoneStep, Modal, Input, Field, Select } from '../components/ui'

const P_COLORS = { high: 'var(--coral)', medium: 'var(--amber)', low: 'var(--green)' }

const OVERALL_BARS = {
  u1: [['Validation','#34d399',100],['Team Building','#34d399',100],['MVP','#5b7fff',60],['Beta','#5b7fff',0],['Fundraise','#fb7185',0]],
  u2: [['Validation','#34d399',100],['Team Assembly','#34d399',100],['MVP Build','#34d399',100],['Pilot Launch','#5b7fff',45],['Seed Round','#fbbf24',0]],
  u3: [['PMF Validated','#34d399',100],['Pre-seed','#34d399',100],['Partnership','#34d399',100],['Seed Round','#5b7fff',75],['Series A Prep','#fb7185',0]],
}

const UPCOMING = {
  u1: [['Apr 2026','MVP demo to 10 design partners','tag-blue'],['May 2026','Beta launch — 50 users','tag-teal'],['Jun 2026','Pitch to 5 seed VCs','tag-amber']],
  u2: [['Apr 2026','Scale to 20K consultations','tag-coral'],['May 2026','Close seed round','tag-green'],['Jun 2026','Launch in 3 new states','tag-blue']],
  u3: [['Apr 2026','Scale to 50K gig workers','tag-green'],['May 2026','Close ₹3Cr seed round','tag-amber'],['Aug 2026','Series A prep','tag-purple']],
}

export default function Progress() {
  const { user } = useAuth()
  const milestones = DB.getMilestones(user.id)
  const [tasks, setTasks] = useState(() => DB.getTasks(user.id))
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ text: '', priority: 'medium', dueDate: '' })

  const refresh = () => setTasks(DB.getTasks(user.id))

  const toggleTask = id => {
    const t = tasks.find(x => x.id === id)
    DB.updateTask(user.id, id, { done: !t.done })
    refresh()
  }

  const deleteTask = id => {
    if (!confirm('Delete this task?')) return
    DB.deleteTask(user.id, id)
    refresh()
  }

  const openAdd = () => {
    setEditId(null)
    setForm({ text: '', priority: 'medium', dueDate: '' })
    setShowModal(true)
  }

  const openEdit = t => {
    setEditId(t.id)
    setForm({ text: t.text, priority: t.priority || 'medium', dueDate: t.dueDate || '' })
    setShowModal(true)
  }

  const saveTask = () => {
    if (!form.text.trim()) return
    if (editId) {
      DB.updateTask(user.id, editId, form)
    } else {
      DB.addTask(user.id, form)
    }
    refresh()
    setShowModal(false)
    setEditId(null)
  }

  const done = tasks.filter(t => t.done).length
  const bars = OVERALL_BARS[user.id] || OVERALL_BARS.u1
  const upcoming = UPCOMING[user.id] || []

  return (
    <Shell title="Progress Tracker" subtitle={`${done}/${tasks.length} tasks complete`}>
      <div className="content-grid">
        <div className="page-section-2col">
          {/* LEFT COLUMN */}
          <div className="page-section">
            {/* Milestone Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone tracker</CardTitle>
                <Tag text={`${done}/${tasks.length} done`} cls="tag-blue" />
              </CardHeader>
              <div className="page-section">
                {milestones.map((s, i) => <MilestoneStep key={i} s={s} />)}
              </div>
            </Card>

            {/* Task List */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <Btn variant="primary" size="sm" onClick={openAdd}>
                  <Ico name="plus" size={12} /> Add Task
                </Btn>
              </CardHeader>

              {tasks.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--muted)' }}>
                  No tasks yet. Add your first task!
                </div>
              ) : (
                <div className="page-section">
                  {tasks.map(t => (
                    <div key={t.id} style={{
                      display: 'flex', alignItems: 'center', gap: '9px',
                      padding: '9px 0', borderBottom: '.5px solid var(--border)'
                    }}>
                      {/* Checkbox */}
                      <div onClick={() => toggleTask(t.id)} style={{
                        width: '16px', height: '16px', borderRadius: '4px', cursor: 'pointer', flexShrink: 0,
                        border: `1.5px solid ${t.done ? 'var(--green)' : 'var(--border2)'}`,
                        background: t.done ? 'rgba(52,211,153,.15)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {t.done && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5 4.5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '12px',
                          textDecoration: t.done ? 'line-through' : 'none',
                          color: t.done ? 'var(--muted)' : 'var(--text)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{t.text}</div>
                        {t.dueDate && (
                          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '1px' }}>
                            Due: {t.dueDate}
                          </div>
                        )}
                      </div>
                      {/* Priority dot */}
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: P_COLORS[t.priority] || 'var(--muted)', flexShrink: 0
                      }} title={`${t.priority} priority`} />
                      {/* Actions */}
                      <Btn size="sm" onClick={() => openEdit(t)} style={{ padding: '3px 6px', flexShrink: 0 }}>
                        <Ico name="edit" size={11} />
                      </Btn>
                      <Btn size="sm" variant="danger" onClick={() => deleteTask(t.id)} style={{ padding: '3px 6px', flexShrink: 0 }}>
                        <Ico name="trash" size={11} />
                      </Btn>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="page-section">
            {/* Overall Progress */}
            <Card>
              <CardHeader><CardTitle>Overall progress</CardTitle></CardHeader>
              <div className="page-section">
                {bars.map(([label, color, val]) => (
                  <div key={label} style={{ marginBottom: '11px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '3px' }}>
                      <span>{label}</span>
                      <span style={{ color }}>{val}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,.06)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '99px', background: color, width: `${val}%`, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Milestones */}
            <Card>
              <CardHeader><CardTitle>Upcoming milestones</CardTitle></CardHeader>
              <div className="page-section">
                {upcoming.map(([date, event, tc]) => (
                  <div key={date} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '8px 0', borderBottom: '.5px solid var(--border)'
                  }}>
                    <Tag text={date} cls={tc} />
                    <span style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.5 }}>{event}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Priority legend */}
            <Card>
              <CardHeader><CardTitle>Priority guide</CardTitle></CardHeader>
              <div className="page-section">
                {[['high', 'var(--coral)', 'Critical — must do this week'],
                  ['medium', 'var(--amber)', 'Important — do this sprint'],
                  ['low', 'var(--green)', 'Nice to have — when possible']].map(([p, c, desc]) => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '6px 0' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', textTransform: 'capitalize', fontWeight: 500, minWidth: '55px' }}>{p}</span>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <Modal title={editId ? 'Edit Task' : 'Add New Task'} onClose={() => setShowModal(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Field label="Task Description *">
              <Input
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="What needs to be done?"
              />
            </Field>
            <div className="grid-cols-2 gap-10">
              <Field label="Priority">
                <Select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  options={[
                    { value: 'high', label: 'High' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'low', label: 'Low' },
                  ]}
                />
              </Field>
              <Field label="Due Date">
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                />
              </Field>
            </div>
            <Btn variant="primary" full onClick={saveTask}>
              {editId ? 'Save Changes' : 'Add Task'}
            </Btn>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
