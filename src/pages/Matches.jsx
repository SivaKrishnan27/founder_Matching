// ── MATCHES PAGE ──────────────────────────────────────────────
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, FounderCard, Modal, Input, Label, Field, SkillTag, OnlineDot } from '../components/ui'

function CoFounderModal({ cf, user, matchPct, onClose }) {
  const navigate = useNavigate()
  const startChat = () => {
    const templates = [
      `Hi ${cf.name.split(' ')[0]}! Found your profile — would love to connect.`,
      `Hi ${cf.name.split(' ')[0]}! Your ${cf.experience} years in ${cf.role} caught my attention.`,
      `Hi ${cf.name.split(' ')[0]}! ${matchPct}% match — let's discuss potential collaboration.`,
    ]
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    DB.startThread(user.id,cf.id, randomTemplate)
    navigate('/chat')
    onClose()
  }
  return (
    <Modal title="Co-founder Profile" onClose={onClose} large>
      <div style={{display:'flex',gap:'14px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
        <Avatar initials={cf.initials} avClass={cf.avClass} size="lg"/>
        <div style={{flex:1,minWidth:'200px'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'19px',fontWeight:800,marginBottom:'4px'}}>{cf.name}{cf.online&&<span style={{display:'inline-block',width:'7px',height:'7px',background:'var(--green)',borderRadius:'50%',marginLeft:'8px'}}/>}</div>
          <div style={{fontSize:'13px',color:'var(--muted)',marginBottom:'8px'}}>{cf.role} · {cf.city}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'8px'}}>{(cf.tags||[]).map((t,i)=><Tag key={t} text={t} cls={(cf.tagClasses||[])[i]||'tag-gray'}/>)}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            <Tag text={`${matchPct}% match`} cls="tag-blue"/>
            {cf.openToEquity&&<Tag text="Open to equity" cls="tag-green"/>}
            {cf.partTime&&<Tag text="Part-time ok" cls="tag-amber"/>}
            {cf.prevStartups>0&&<Tag text={`${cf.prevStartups} prev startup${cf.prevStartups>1?'s':''}`} cls="tag-gray"/>}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'7px',flexShrink:0}}>
          <Btn variant="primary" onClick={startChat}><Ico name="chat" size={12}/> Message</Btn>
          {cf.linkedIn&&<a href={cf.linkedIn} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 13px',background:'rgba(255,255,255,.05)',border:'.5px solid rgba(255,255,255,.13)',borderRadius:'8px',color:'var(--text)',fontSize:'12px',textDecoration:'none'}}><Ico name="link" size={12}/> LinkedIn</a>}
          {cf.github&&<a href={cf.github} target="_blank" rel="noreferrer" style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 13px',background:'rgba(255,255,255,.05)',border:'.5px solid rgba(255,255,255,.13)',borderRadius:'8px',color:'var(--text)',fontSize:'12px',textDecoration:'none'}}><Ico name="link" size={12}/> GitHub</a>}
        </div>
      </div>
      <Card style={{marginBottom:'12px'}}><div style={{fontSize:'13px',lineHeight:1.8,color:'var(--muted)'}}>{cf.bio||'No bio yet.'}</div></Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <Card>
          <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Experience</div>
          {[['Experience',cf.experience||'—'],['Prev Startups',cf.prevStartups||0],['City',cf.city||'—'],['Email',cf.email||'—']].map(([l,v])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',padding:'4px 0',borderBottom:'.5px solid var(--border)'}}><span style={{color:'var(--muted)'}}>{l}</span><strong>{v}</strong></div>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Skills</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{(cf.skills||[]).map(s=><Tag key={s} text={s} cls="tag-gray"/>)}</div>
        </Card>
      </div>
    </Modal>
  )
}

export function Matches() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const FILTERS = ['All','Tech','Marketing','Finance','Design','AI/ML','Sales','Legal']
  const [filter, setFilter] = useState('All')
  const [all, setAll] = useState(DB.getCoFounders())
  const [selCF, setSelCF] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({name:'',role:'',city:'',email:'',experience:'',bio:'',skills:'',linkedIn:'',github:'',openToEquity:true,partTime:false,prevStartups:0})

  const ideas = DB.getIdeasForUser(user.id)
  const primaryIdea = ideas[0]

  const calculateMatch = (idea, cf) => {
    if (!idea || !idea.lookingFor) return 75
    const lookingFor = idea.lookingFor
    const skills = cf.skills || []
    let match = 60
    lookingFor.forEach(lf => {
      skills.forEach(s => {
        if (s.toLowerCase().includes(lf.toLowerCase().split(' ')[0]) || lf.toLowerCase().includes(s.toLowerCase().split(' ')[0])) {
          match += 10
        }
      })
    })
    match = Math.min(match, 95)
    return Math.round(match + Math.random() * 5)
  }

  const filtered = filter==='All' ? all : all.filter(f=>(f.tags||[]).some(t=>t.toLowerCase().includes(filter.toLowerCase()))||(f.skills||[]).some(s=>s.toLowerCase().includes(filter.toLowerCase())))

  const addCF = () => {
    if(!form.name||!form.role) return
    DB.addCoFounder({...form,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),prevStartups:+form.prevStartups||0})
    setAll(DB.getCoFounders()); setShowAdd(false)
  }

  const startChat = cf => { DB.startThread(user.id,cf.id,`Hi ${cf.name.split(' ')[0]}! I'd love to connect.`); navigate('/chat') }

  return (
    <Shell title="Co-founder Match" subtitle="AI-curated matches for your profile">
      <div className="content-grid">
        <div className="page-section">
          <div >
            <span style={{fontSize:'11px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif'"}}>{filtered.length} co-founders</span>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:'6px', alignItems:'center'}}>
              {FILTERS.map(f=><SkillTag key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>)}
              <Btn variant="primary" size="sm" onClick={()=>setShowAdd(true)}><Ico name="plus" size={12}/> Add Co-founder</Btn>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {filtered.map(f => {
              const matchPct = calculateMatch(primaryIdea, f)
              return (
                <Card key={f.id} style={{padding: '16px', cursor: 'pointer'}} onClick={() => setSelCF(f)}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <Avatar initials={f.initials} avClass={f.avClass} size="md" />
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                        <span style={{fontFamily: "'Syne', sans-serif", fontSize: '16px', fontWeight: 800}}>{f.name}</span>
                        {f.online && <OnlineDot />}
                        <Tag text={`${matchPct}% match`} cls="tag-blue" />
                      </div>
                      <div style={{fontSize: '13px', color: 'var(--muted)', marginBottom: '6px'}}>{f.role} · {f.city}</div>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                        {(f.tags || []).slice(0, 3).map((t, i) => <Tag key={t} text={t} cls={(f.tagClasses || [])[i] || 'tag-gray'} />)}
                      </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end'}}>
                      <Btn variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); startChat(f); }}><Ico name="chat" size={12} /> Message</Btn>
                      <Btn variant="secondary" size="sm" onClick={() => setSelCF(f)}>View Profile</Btn>
                    </div>
                  </div>
                </Card>
              )
            }).sort((a, b) => b.props.matchPct - a.props.matchPct)}
          </div>
          <Card>
            <CardHeader><CardTitle>Why these matches?</CardTitle></CardHeader>
            <p style={{fontSize:'13px',color:'var(--muted)',lineHeight:1.7}}>Our AI analyzes 40+ signals — skills, startup stage, domain interest, working style, and prior experience — to surface co-founders who complement <strong style={{color:'var(--text)'}}>{user.name}</strong>'s stated needs: <em style={{color:'var(--acc)'}}>{(user.lookingFor||[]).join(', ')||'update your profile'}</em>.</p>
          </Card>
        </div>
      </div>
      {selCF&&<CoFounderModal cf={selCF} user={user} matchPct={calculateMatch(primaryIdea, selCF)} onClose={()=>setSelCF(null)}/>}
      {showAdd&&(
        <Modal title="Add New Co-founder" onClose={()=>setShowAdd(false)} large>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {[['Full Name *','name'],['Role / Title *','role'],['City','city'],['Email','email'],['Experience','experience'],['LinkedIn','linkedIn'],['GitHub','github']].map(([l,k])=>(
              <div key={k}><Field label={l}><Input value={form[k]||''} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}/></Field></div>
            ))}
            <div style={{gridColumn:'1/-1'}}><Field label="Bio"><Input value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} placeholder="Brief bio..." multiline rows={3}/></Field></div>
            <div style={{gridColumn:'1/-1'}}><Field label="Skills (comma-separated)"><Input value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))} placeholder="e.g. React, Node.js, MongoDB"/></Field></div>
            <div><label style={{display:'flex',gap:'6px',alignItems:'center',fontSize:'13px',cursor:'pointer'}}><input type="checkbox" checked={form.openToEquity} onChange={e=>setForm(f=>({...f,openToEquity:e.target.checked}))}/> Open to equity</label></div>
            <div><label style={{display:'flex',gap:'6px',alignItems:'center',fontSize:'13px',cursor:'pointer'}}><input type="checkbox" checked={form.partTime} onChange={e=>setForm(f=>({...f,partTime:e.target.checked}))}/> Part-time ok</label></div>
          </div>
          <Btn variant="primary" full style={{marginTop:'14px'}} onClick={addCF}>Add Co-founder</Btn>
        </Modal>
      )}
    </Shell>
  )
}
export default Matches
