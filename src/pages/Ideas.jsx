// ================================================================
// Ideas page
// ================================================================
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, IdeaCard, Modal, Input, Label, Field, Select } from '../components/ui'

const TAG_OPTIONS = [['LegalTech','tag-blue'],['LogisTech','tag-teal'],['SaaS','tag-purple'],['EdTech','tag-amber'],['HealthTech','tag-coral'],['FinTech','tag-green'],['AI/ML','tag-blue'],['HRTech','tag-teal'],['AgriTech','tag-amber']]
const STAGES = ['Ideation','MVP','Beta','Seed','Series A']

function IdeaDetailModal({ idea, user, onClose }) {
  const allUsers = DB.getAllUsers()
  const poster = allUsers.find(u => u.id === idea.postedBy)
  return (
    <Modal title="Startup Idea Details" onClose={onClose} large>
      <div style={{display:'flex',gap:'12px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
        <div style={{fontSize:'40px',lineHeight:1}}>{idea.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'19px',fontWeight:800,marginBottom:'7px'}}>{idea.title}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            <Tag text={idea.tag} cls={idea.tagClass}/><Tag text={idea.stage} cls="tag-gray"/>
            <Tag text={`${idea.looking} looking`} cls="tag-blue"/><Tag text={`${idea.saves} saves`} cls="tag-amber"/><Tag text={`${idea.views} views`} cls="tag-teal"/>
          </div>
        </div>
      </div>
      {poster&&<div style={{display:'flex',gap:'10px',alignItems:'center',padding:'10px 12px',background:'var(--surface)',borderRadius:'10px',marginBottom:'14px',flexWrap:'wrap'}}>
        <Avatar initials={poster.initials} avClass={poster.avClass} size="sm"/>
        <div><div style={{fontSize:'12px',fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{poster.name}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>{poster.role} · {poster.city}</div></div>
        <Tag text="Posted by" cls="tag-gray"/>
      </div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'14px'}}>
        {[['Problem',idea.problem,'var(--coral)'],['Solution',idea.solution,'var(--green)'],['Market',idea.market,'var(--amber)'],['Traction',idea.traction,'var(--acc)']].map(([h,t,c])=>(
          <Card key={h} style={{padding:'12px'}}>
            <div style={{fontSize:'10px',color:c,textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif",marginBottom:'5px'}}>{h}</div>
            <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:1.6}}>{t||'—'}</div>
          </Card>
        ))}
      </div>
      {idea.fullDesc&&<Card style={{marginBottom:'14px'}}><div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Full Description</div><div style={{fontSize:'13px',lineHeight:1.8,color:'var(--muted)'}}>{idea.fullDesc}</div></Card>}
      <Card style={{marginBottom:'16px'}}>
        <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Looking for co-founders</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>{(idea.lookingFor||[]).map(r=><Tag key={r} text={r} cls="tag-blue"/>)}</div>
      </Card>
      <div style={{display:'flex',gap:'8px'}}>
        <Btn variant="primary" style={{flex:1}} onClick={()=>{DB.saveIdea(idea.id);onClose()}}><Ico name="check" size={13}/> Save Idea</Btn>
        <Btn style={{flex:1}} onClick={onClose}>Close</Btn>
      </div>
    </Modal>
  )
}

export default function Ideas() {
  const { user } = useAuth()
  const [ideas, setIdeas] = useState(DB.getIdeas())
  const [selIdea, setSelIdea] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({emoji:'💡',title:'',shortDesc:'',fullDesc:'',problem:'',solution:'',market:'',traction:'',stage:'Ideation',tag:'LegalTech',tagClass:'tag-blue',lookingFor:'',looking:2})

  const viewIdea = idea => { DB.viewIdea(idea.id); setSelIdea(idea) }

  const postIdea = () => {
    if(!form.title||!form.shortDesc) return
    DB.addIdea({...form,postedBy:user.id,lookingFor:form.lookingFor.split(',').map(s=>s.trim()).filter(Boolean)})
    setIdeas(DB.getIdeas()); setShowAdd(false)
  }

  const setTag = tagName => {
    const opt = TAG_OPTIONS.find(([t])=>t===tagName)||['SaaS','tag-purple']
    setForm(f=>({...f,tag:opt[0],tagClass:opt[1]}))
  }

  return (
    <Shell title="Startup Ideas" subtitle="Explore and post detailed startup ideas">
      <div className="content-grid">
        <div className="page-section">
          <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'8px', alignItems:'center'}}>
            <span style={{fontSize:'11px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif'"}}>{ideas.length} ideas</span>
            <Btn variant="primary" onClick={()=>setShowAdd(true)}><Ico name="plus" size={12}/> Post Detailed Idea</Btn>
          </div>
          <div className="grid-auto-fit">
            {ideas.map(i=><IdeaCard key={i.id} idea={i} onView={viewIdea}/>)}
          </div>
        </div>
      </div>
      {selIdea&&<IdeaDetailModal idea={selIdea} user={user} onClose={()=>setSelIdea(null)}/>}
      {showAdd&&(
        <Modal title="Post a Detailed Startup Idea" onClose={()=>setShowAdd(false)} large>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            <div style={{gridColumn:'1/-1'}}><Field label="Idea Title *"><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. AI Legal Assistant for Indian Startups"/></Field></div>
            <div style={{gridColumn:'1/-1'}}><Field label="Short Description *"><Input value={form.shortDesc} onChange={e=>setForm(f=>({...f,shortDesc:e.target.value}))} placeholder="One powerful line pitch"/></Field></div>
            {[['Problem *','problem','What painful problem does this solve?'],['Solution *','solution','How do you solve it uniquely?'],['Target Market','market','Market size, TAM, audience…'],['Traction','traction','Waitlist, pilots, revenue, interviews…']].map(([l,k,p])=>(
              <div key={k}><Field label={l}><Input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={p} multiline rows={3}/></Field></div>
            ))}
            <div style={{gridColumn:'1/-1'}}><Field label="Full Description (for co-founders)"><Input value={form.fullDesc} onChange={e=>setForm(f=>({...f,fullDesc:e.target.value}))} placeholder="Detailed context for potential co-founders…" multiline rows={4}/></Field></div>
            <div><Field label="Emoji Icon"><Input value={form.emoji} onChange={e=>setForm(f=>({...f,emoji:e.target.value}))} style={{fontSize:'20px',textAlign:'center'}}/></Field></div>
            <div><Field label="Category"><Select value={form.tag} onChange={e=>setTag(e.target.value)} options={TAG_OPTIONS.map(([t])=>t)}/></Field></div>
            <div><Field label="Stage"><Select value={form.stage} onChange={e=>setForm(f=>({...f,stage:e.target.value}))} options={STAGES}/></Field></div>
            <div><Field label="Co-founders Needed"><Input type="number" value={form.looking} onChange={e=>setForm(f=>({...f,looking:+e.target.value}))}/></Field></div>
            <div style={{gridColumn:'1/-1'}}><Field label="Looking for (comma-separated roles)"><Input value={form.lookingFor} onChange={e=>setForm(f=>({...f,lookingFor:e.target.value}))} placeholder="e.g. Tech CTO, Growth Marketer, Legal Advisor"/></Field></div>
          </div>
          <Btn variant="primary" full style={{marginTop:'14px'}} onClick={postIdea}>Post Idea</Btn>
        </Modal>
      )}
    </Shell>
  )
}
