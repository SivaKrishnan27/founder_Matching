import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Tag, Avatar, ScoreRing, Sparkline, MetricCard } from '../components/ui'

const TRAFFIC_COLORS = ['var(--acc)', 'var(--teal)', 'var(--amber)', 'var(--green)', 'var(--muted)']
const USER_ACCENTS   = { u1: '#5b7fff', u2: '#a78bfa', u3: '#34d399' }

export default function Analytics() {
  const { user } = useAuth()
  const data      = DB.getAnalytics(user.id)
  const allUsers  = DB.getAllUsers()

  const loginDates   = user.loginHistory || []
  const march1Offset = 6 // March 1 2026 = Sunday → 6 offset in Mon-first grid

  const calDays = Array.from({ length: 31 }, (_, i) => {
    const d = `2026-03-${String(i + 1).padStart(2, '0')}`
    return { day: i + 1, active: loginDates.includes(d) }
  })

  return (
    <Shell title="Analytics" subtitle="Your startup journey insights">
      <div className="content-grid">
        {/* Label row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.8px', fontFamily: "'Syne',sans-serif'" }}>
            Analytics · March 2026
          </span>
          <Tag text={`${user.name.split(' ')[0]}'s data`} cls="tag-blue" />
        </div>

        {/* Metrics */}
        <div className="grid-cols-4 gap-10">
          <MetricCard label="Profile Views"    value={data.metrics.profileViews.toLocaleString()} sub={<><span style={{color:'var(--green)'}}>{data.trends.profileViews}</span> vs last month</>} colorClass="m-blue"  delay={.05} />
          <MetricCard label="Connect Requests" value={data.metrics.connects}                       sub={<><span style={{color:'var(--green)'}}>{data.trends.connects}</span> this month</>}    colorClass="m-green" delay={.1}  />
          <MetricCard label="Idea Saves"       value={data.metrics.ideaSaves}                      sub={<><span style={{color:'var(--green)'}}>{data.trends.ideaSaves}</span> this week</>}     colorClass="m-amber" delay={.15} />
          <MetricCard label="Chat Opens"       value={data.metrics.chatOpens}                      sub={<><span style={{color:'var(--green)'}}>{data.trends.chatOpens}</span> this month</>}    colorClass="m-coral" delay={.2}  />
        </div>

        {/* Sparkline */}
        <Card>
          <CardHeader>
            <CardTitle>Daily profile views — last 30 days</CardTitle>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Peak: {Math.max(...data.sparkData)}</span>
          </CardHeader>
          <Sparkline data={data.sparkData} height={58} />
        </Card>

        {/* Login calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Login activity — March 2026</CardTitle>
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--muted)', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--green)' }}>✓ {data.loginDays} login days</span>
              <span>🔥 {data.streakDays}-day streak</span>
            </div>
          </CardHeader>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px', marginBottom: '5px' }}>
            {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
              <div key={d} style={{ fontSize: '9px', color: 'var(--muted)', textAlign: 'center', paddingBottom: '3px' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
            {Array(march1Offset).fill(null).map((_, i) => <div key={`e${i}`} />)}
            {calDays.map(({ day, active }) => (
              <div key={day} title={`Mar ${day}${active ? ' — logged in' : ''}`} style={{
                height: '14px', borderRadius: '2px',
                background: active ? `${user.accentColor}99` : 'rgba(255,255,255,.04)',
                border: active ? `1px solid ${user.accentColor}` : '1px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7px', color: active ? '#fff' : 'var(--muted)',
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '11px', color: 'var(--muted)' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: `${user.accentColor}99`, border: `1px solid ${user.accentColor}` }} />
            <span>Login day</span>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(255,255,255,.04)', marginLeft: '8px' }} />
            <span>No activity</span>
          </div>
        </Card>

        {/* Traffic + Completion */}
        <div className="page-section-2col">
          <Card>
            <CardHeader><CardTitle>Traffic sources</CardTitle></CardHeader>
            {data.traffic.map(([src, pct], i) => (
              <div key={src} style={{ marginBottom: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginBottom: '3px' }}>
                  <span>{src}</span>
                  <span style={{ color: TRAFFIC_COLORS[i] }}>{pct}%</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '99px', background: TRAFFIC_COLORS[i], width: `${pct}%`, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardHeader><CardTitle>Profile completion</CardTitle></CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <ScoreRing score={data.profileScore} size={80} />
              <div style={{ flex: 1, minWidth: '120px' }}>
                {data.completion.map(([label, val]) => {
                  const color = val === 100 ? 'var(--green)' : val >= 80 ? 'var(--acc)' : 'var(--amber)'
                  return (
                    <div key={label} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '2px' }}>
                        <span>{label}</span>
                        <span style={{ color }}>{val}%</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,.06)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '99px', background: color, width: `${val}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* User comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Compare with all users</CardTitle>
            <Tag text="3 active users" cls="tag-teal" />
          </CardHeader>
          <div className="grid-auto-fit">
            {allUsers.map(u => {
              const d    = DB.getAnalytics(u.id)
              const isMe = u.id === user.id
              const acc  = USER_ACCENTS[u.id] || '#5b7fff'
              return (
                <div key={u.id} style={{
                  padding: '13px',
                  background: isMe ? `${acc}18` : 'var(--surface)',
                  border: `.5px solid ${isMe ? acc : 'var(--border)'}`,
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                    <Avatar initials={u.initials} avClass={u.avClass} size="sm" />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: "'Syne',sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {u.name.split(' ')[0]}
                        {isMe && <Tag text="You" cls="tag-blue" style={{ marginLeft: '4px' }} />}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{u.role.split(' ').slice(0, 2).join(' ')}</div>
                    </div>
                  </div>
                  {[
                    ['Profile Views', d.metrics.profileViews.toLocaleString()],
                    ['Connects',      d.metrics.connects],
                    ['Login Days',    d.loginDays],
                    ['Streak',        `${d.streakDays} days`],
                    ['Score',         `${d.profileScore}%`],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '3px 0', borderBottom: '.5px solid var(--border)' }}>
                      <span style={{ color: 'var(--muted)' }}>{l}</span>
                      <strong style={{ color: isMe ? acc : 'var(--text)' }}>{v}</strong>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Multi-user sparklines */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement over time — all users</CardTitle>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Profile views last 30 days</span>
          </CardHeader>
          <div className="page-section">
            {allUsers.map(u => {
              const d    = DB.getAnalytics(u.id)
              const acc  = USER_ACCENTS[u.id] || '#5b7fff'
              const isMe = u.id === user.id
              return (
                <div key={u.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <Avatar initials={u.initials} avClass={u.avClass} size="sm" />
                    <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>{u.name.split(' ')[0]}</span>
                    {isMe && <Tag text="You" cls="tag-blue" />}
                    <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: 'auto' }}>Peak: {Math.max(...d.sparkData)}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '36px' }}>
                    {d.sparkData.map((h, i) => (
                      <div key={i} style={{
                        flex: 1, minHeight: '3px', height: `${h}%`,
                        borderRadius: '2px 2px 0 0',
                        background: `${acc}${isMe ? 'cc' : '55'}`,
                      }} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </Shell>
  )
}
