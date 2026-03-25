import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, FounderCard, Modal, SkillTag } from '../components/ui'

const ALL_SKILLS = ['React','Node.js','Python','AI/ML','Figma','Growth','FinTech','MongoDB','AWS','Product','Sales','Legal','Design','BD','Marketing','PyTorch','DevOps','NLP']

export default function Skills() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeSkills, setActiveSkills] = useState([])
  const [selCF, setSelCF] = useState(null)
  const all = DB.getCoFounders()

  const results = all.filter(f => {
    const q = query.toLowerCase()
    const mqry = !q || f.name.toLowerCase().includes(q) || f.role.toLowerCase().includes(q) || (f.skills||[]).some(s=>s.toLowerCase().includes(q))
    const mskl = activeSkills.length===0 || activeSkills.some(s=>(f.skills||[]).some(fs=>fs.toLowerCase().includes(s.toLowerCase())))
    return mqry && mskl
  }).sort((a,b)=>(b.match?.[user.id]||70)-(a.match?.[user.id]||70))

  const toggle = s => setActiveSkills(p => p.includes(s)?p.filter(x=>x!==s):[...p,s])

  const startChat = cf => {
    DB.startThread(user.id, cf.id, 'Hi! Found your profile via skill search — would love to connect!')
    navigate('/chat')
  }

  return (
    <Shell title="Skill Search" subtitle="Find founders by skill set">
      <div className="content-grid">
        <Card>
          <CardHeader>
            <CardTitle>Filter by skill</CardTitle>
            {activeSkills.length>0&&<span style={{fontSize:'12px',color:'var(--muted)'}}>{activeSkills.length} skill{activeSkills.length>1?'s':''} selected</span>}
          </CardHeader>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'14px'}}>
            {ALL_SKILLS.map(s=><SkillTag key={s} label={s} active={activeSkills.includes(s)} onClick={()=>toggle(s)}/>)}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px',background:'var(--surface)',border:'.5px solid var(--border2)',borderRadius:'8px',padding:'8px 12px',marginBottom:'14px',maxWidth:'420px'}}>
            <Ico name="search" size={13} style={{color:'var(--muted)',flexShrink:0}}/>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by name, role, or skill…" style={{flex:1,background:'none',border:'none',outline:'none',fontSize:'13px',color:'var(--text)',fontFamily:"'DM Sans',sans-serif"}}/>
          </div>
          <div style={{fontSize:'12px',color:'var(--muted)',marginBottom:'10px'}}>{results.length} result{results.length!==1?'s':''}</div>
          <div className="grid-cols-2 gap-8" style={{marginBottom:'14px'}}>
            {results.map(f=>(
              <div key={f.id} onClick={()=>setSelCF(f)} style={{background:'var(--surface)',border:'.5px solid var(--border)',borderRadius:'9px',padding:'9px',display:'flex',gap:'7px',alignItems:'center',cursor:'pointer',transition:'border-color .15s'}}>
                <Avatar initials={f.initials} avClass={f.avClass} size="sm"/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'12px',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontFamily:"'Syne',sans-serif"}}>{f.name}</div>
                  <div style={{fontSize:'11px',color:'var(--muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.role}</div>
                </div>
                <div style={{fontSize:'14px',fontWeight:700,fontFamily:"'Syne',sans-serif",color:'var(--acc)',flexShrink:0}}>{f.match?.[user.id]||70}%</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="page-section">
          {results.map(f=><FounderCard key={f.id} f={f} userId={user.id} onView={setSelCF} onChat={startChat}/>)}
        </div>
      </div>
      {selCF&&(
        <Modal title="Co-founder Profile" onClose={()=>setSelCF(null)} large>
          <div style={{display:'flex',gap:'14px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
            <Avatar initials={selCF.initials} avClass={selCF.avClass} size="lg"/>
            <div style={{flex:1,minWidth:'180px'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:800,marginBottom:'3px'}}>{selCF.name}</div>
              <div style={{fontSize:'12px',color:'var(--muted)',marginBottom:'8px'}}>{selCF.role} · {selCF.city}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{(selCF.tags||[]).map((t,i)=><Tag key={t} text={t} cls={(selCF.tagClasses||[])[i]||'tag-gray'}/>)}<Tag text={`${selCF.match?.[user.id]||75}% match`} cls="tag-blue"/></div>
            </div>
            <Btn variant="primary" onClick={()=>startChat(selCF)}><Ico name="chat" size={12}/> Chat</Btn>
          </div>
          <div style={{background:'var(--card)',border:'.5px solid var(--border)',borderRadius:'14px',padding:'12px',marginBottom:'12px'}}>
            <div style={{fontSize:'13px',lineHeight:1.7,color:'var(--muted)'}}>{selCF.bio||'No bio yet.'}</div>
          </div>
          <div style={{background:'var(--card)',border:'.5px solid var(--border)',borderRadius:'14px',padding:'12px'}}>
            <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Skills</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{(selCF.skills||[]).map(s=><Tag key={s} text={s} cls="tag-gray"/>)}</div>
          </div>
        </Modal>
      )}
    </Shell>
  )
}
