// ================================================================
// MyStartups page
// ================================================================
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar, Modal, Input, Field, Select, MiniBar } from '../components/ui'

const STAGES = ['Ideation','MVP','Beta','Seed','Series A']
const STAGE_CLS = {Ideation:'tag-amber',MVP:'tag-blue',Beta:'tag-teal',Seed:'tag-green','Series A':'tag-purple'}
const WF_COLORS = {done:'var(--green)',active:'var(--acc)',planned:'var(--muted)'}

export default function MyStartups() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [startups, setStartups] = useState(() => DB.getStartupsForUser(user.id))
  const [viewingId, setViewingId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showWf, setShowWf] = useState(false)
  const [postText, setPostText] = useState('')
  const [wfForm, setWfForm] = useState({name:'',status:'planned'})
  const [form, setForm] = useState({name:'',tagline:'',desc:'',stage:'Ideation',fundingTarget:'₹50 L',lookingForFunding:false,lookingForCoFounders:true,neededRoles:'',website:''})

  const refresh = () => setStartups(DB.getStartupsForUser(user.id))
  const viewing = viewingId ? DB.getStartup(viewingId) : null

  const createStartup = () => {
    if(!form.name) return
    DB.addStartup({...form,ownerId:user.id,stageClass:STAGE_CLS[form.stage]||'tag-gray',neededRoles:form.neededRoles.split(',').map(s=>s.trim()).filter(Boolean)})
    refresh(); setShowAdd(false)
  }

  const addPost = () => {
    if(!postText.trim()||!viewingId) return
    DB.addPost(viewingId, postText, user.name); refresh(); setPostText('')
    setViewingId(viewingId) // force re-read
  }

  const addWf = () => {
    if(!wfForm.name.trim()||!viewingId) return
    DB.addWorkflow(viewingId, wfForm.name, wfForm.status); refresh(); setShowWf(false)
  }

  const delWf = wfId => { DB.deleteWorkflow(viewingId, wfId); refresh() }
  const updateWf = (wfId, status) => { DB.updateWorkflow(viewingId, wfId, {status}); refresh() }

  if (viewing) {
    const s = DB.getStartup(viewingId) || viewing
    return (
      <Shell title={s.name} subtitle={s.tagline}>
        <Btn onClick={()=>setViewingId(null)} style={{alignSelf:'flex-start'}}><Ico name="back" size={13}/> Back</Btn>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
          <Card>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:'17px',fontWeight:800,marginBottom:'3px'}}>{s.name}</div>
            <div style={{fontSize:'13px',fontStyle:'italic',color:'var(--muted)',marginBottom:'8px'}}>"{s.tagline}"</div>
            <div style={{fontSize:'12px',color:'var(--muted)',marginBottom:'10px',lineHeight:1.6}}>{s.desc}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'12px'}}>
              <Tag text={s.stage} cls={s.stageClass||'tag-gray'}/>
              {s.lookingForFunding&&<Tag text="Seeking Funding" cls="tag-green"/>}
              {s.lookingForCoFounders&&<Tag text="Seeking Co-founders" cls="tag-blue"/>}
            </div>
            <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'99px',overflow:'hidden',marginBottom:'4px'}}>
              <div style={{height:'100%',borderRadius:'99px',background:'var(--acc)',width:`${s.progress}%`}}/>
            </div>
            <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'12px'}}>{s.progress}% overall progress</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              <div style={{background:'var(--surface)',borderRadius:'8px',padding:'10px 12px'}}><div style={{fontSize:'10px',color:'var(--muted)',marginBottom:'2px'}}>FUNDING TARGET</div><div style={{fontSize:'16px',fontWeight:700,fontFamily:"'Syne',sans-serif",color:'var(--green)'}}>{s.fundingTarget||'—'}</div></div>
              <div style={{background:'var(--surface)',borderRadius:'8px',padding:'10px 12px'}}><div style={{fontSize:'10px',color:'var(--muted)',marginBottom:'2px'}}>RAISED SO FAR</div><div style={{fontSize:'16px',fontWeight:700,fontFamily:"'Syne',sans-serif",color:'var(--acc)'}}>{s.fundingRaised||'₹0'}</div></div>
            </div>
            {s.website&&<div style={{marginTop:'10px'}}><a href={s.website} target="_blank" rel="noreferrer" style={{fontSize:'12px',color:'var(--acc)',display:'flex',alignItems:'center',gap:'4px'}}><Ico name="link" size={11}/>{s.website}</a></div>}
          </Card>
          <Card>
            <CardHeader><CardTitle>Workflows</CardTitle><Btn size="sm" variant="primary" onClick={()=>setShowWf(true)}><Ico name="plus" size={11}/> Add</Btn></CardHeader>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px'}}>
              {(s.team||[]).map(tid=>{ const u=DB.getAllUsers().find(x=>x.id===tid)||DB.getCoFounder(tid); return u?<Avatar key={tid} initials={u.initials} avClass={u.avClass}/>:null; })}
            </div>
            {(s.neededRoles||[]).length>0&&<div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'12px'}}>{s.neededRoles.map(r=><Tag key={r} text={'Hiring: '+r} cls="tag-amber"/>)}</div>}
            <div style={{display:'flex',flexDirection:'column',gap:'5px'}}>
              {(s.workflows||[]).map(wf=>(
                <div key={wf.id} style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',background:'var(--surface)',borderRadius:'8px'}}>
                  <div style={{width:'7px',height:'7px',borderRadius:'50%',background:WF_COLORS[wf.status],flexShrink:0}}/>
                  <span style={{flex:1,fontSize:'12px'}}>{wf.name}</span>
                  <select onChange={e=>updateWf(wf.id,e.target.value)} value={wf.status} style={{background:'none',border:'none',color:'var(--muted)',fontSize:'11px',cursor:'pointer',outline:'none'}}>
                    <option value="planned">Planned</option><option value="active">Active</option><option value="done">Done</option>
                  </select>
                  <Btn size="sm" variant="danger" onClick={()=>delWf(wf.id)} style={{padding:'2px 6px'}}><Ico name="trash" size={11}/></Btn>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Startup Posts</CardTitle><Tag text="Visible to all" cls="tag-blue"/></CardHeader>
          <div style={{display:'flex',gap:'8px',marginBottom:'14px'}}>
            <input value={postText} onChange={e=>setPostText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPost()}
              placeholder="Share an update, milestone, or announcement…"
              style={{flex:1,background:'var(--surface)',border:'.5px solid var(--border2)',borderRadius:'8px',padding:'8px 11px',color:'var(--text)',fontSize:'13px',fontFamily:"'DM Sans',sans-serif",outline:'none'}}/>
            <Btn variant="primary" size="sm" onClick={addPost}>Post</Btn>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            {(s.posts||[]).length===0&&<div style={{fontSize:'12px',color:'var(--muted)',textAlign:'center',padding:'16px'}}>No posts yet. Share your first update!</div>}
            {[...(s.posts||[])].reverse().map(p=>(
              <div key={p.id} style={{padding:'12px 14px',background:'var(--surface)',borderRadius:'10px',border:'.5px solid var(--border)'}}>
                <div style={{fontSize:'13px',lineHeight:1.7,marginBottom:'7px'}}>{p.text}</div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'var(--muted)'}}>
                  <span>— {p.author}</span><span>{p.ts} · {p.likes} likes</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
          <Btn variant="primary" onClick={()=>navigate('/investors')}>Find Investors</Btn>
          <Btn onClick={()=>navigate('/matches')}>Find Co-founders</Btn>
          <Btn onClick={()=>navigate('/investor-match')}>Investor Match Pipeline</Btn>
          <Btn onClick={()=>navigate('/progress')}>Progress Tracker</Btn>
        </div>
        {showWf&&<Modal title="Add Workflow Step" onClose={()=>setShowWf(false)}>
          <div style={{display:'flex',flexDirection:'column',gap:'11px'}}>
            <Field label="Workflow Name *"><Input value={wfForm.name} onChange={e=>setWfForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Investor Outreach"/></Field>
            <Field label="Status"><Select value={wfForm.status} onChange={e=>setWfForm(f=>({...f,status:e.target.value}))} options={['planned','active','done']}/></Field>
            <Btn variant="primary" onClick={addWf}>Add Workflow</Btn>
          </div>
        </Modal>}
      </Shell>
    )
  }

  return (
    <Shell title="My Startups" subtitle="Manage your ventures">
      <div className="content-grid">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
          <span style={{fontSize:'11px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif'"}}>{startups.length} startup{startups.length!==1?'s':''}</span>
          <Btn variant="primary" onClick={()=>setShowAdd(true)}><Ico name="plus" size={12}/> New Startup</Btn>
        </div>
        <div className="page-section">
          {startups.length===0&&<Card style={{textAlign:'center',padding:'32px',color:'var(--muted)'}}>No startups yet. Create your first one!</Card>}
          {startups.map(s=>(
            <Card key={s.id} style={{cursor:'pointer'}} onClick={()=>setViewingId(s.id)}>
              <div style={{display:'flex',gap:'12px',alignItems:'flex-start',flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:'200px'}}>
                  <div style={{display:'flex',gap:'8px',alignItems:'center',marginBottom:'5px',flexWrap:'wrap'}}>
                    <span style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:800}}>{s.name}</span>
                    <Tag text={s.stage} cls={s.stageClass||'tag-gray'}/>
                    {s.lookingForFunding&&<Tag text="Seeking Funding" cls="tag-green"/>}
                  </div>
                  <div style={{fontSize:'12px',color:'var(--muted)',marginBottom:'9px',lineHeight:1.5}}>{s.desc||s.tagline}</div>
                  <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'99px',overflow:'hidden',marginBottom:'4px'}}><div style={{height:'100%',borderRadius:'99px',background:'var(--acc)',width:`${s.progress}%`}}/></div>
                  <div style={{fontSize:'11px',color:'var(--muted)'}}>{s.progress}% complete · {s.team?.length||1} team member{(s.team?.length||1)!==1?'s':''}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'5px',alignItems:'flex-end',flexShrink:0}}>
                  <div style={{fontSize:'12px',color:'var(--muted)'}}>Target: <strong style={{color:'var(--green)'}}>{s.fundingTarget||'—'}</strong></div>
                  <div style={{fontSize:'12px',color:'var(--muted)'}}>Raised: <strong style={{color:'var(--acc)'}}>{s.fundingRaised||'₹0'}</strong></div>
                  <Btn size="sm" variant="primary" onClick={e=>{e.stopPropagation();setViewingId(s.id)}}><Ico name="arrow" size={12}/> Manage</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {showAdd&&<Modal title="Create New Startup" onClose={()=>setShowAdd(false)} large>
        <div className="grid-cols-2 gap-12">
          <div style={{gridColumn:'1/-1'}}><Field label="Startup Name *"><Input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. FounderOS"/></Field></div>
          <div style={{gridColumn:'1/-1'}}><Field label="Tagline"><Input value={form.tagline} onChange={e=>setForm(f=>({...f,tagline:e.target.value}))} placeholder="e.g. The OS for Indian Startups"/></Field></div>
          <div style={{gridColumn:'1/-1'}}><Field label="Description"><Input value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="What does your startup do?" multiline rows={3}/></Field></div>
          <div><Field label="Stage"><Select value={form.stage} onChange={e=>setForm(f=>({...f,stage:e.target.value}))} options={STAGES}/></Field></div>
          <div><Field label="Funding Target"><Input value={form.fundingTarget} onChange={e=>setForm(f=>({...f,fundingTarget:e.target.value}))} placeholder="e.g. ₹1.5 Cr"/></Field></div>
          <div><Field label="Website (optional)"><Input value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} placeholder="https://yourstartup.in"/></Field></div>
          <div><Field label="Roles Needed (comma-separated)"><Input value={form.neededRoles} onChange={e=>setForm(f=>({...f,neededRoles:e.target.value}))} placeholder="e.g. CTO, Growth Lead"/></Field></div>
          <div style={{gridColumn:'1/-1',display:'flex',gap:'20px'}}>
            <label style={{display:'flex',gap:'6px',alignItems:'center',fontSize:'13px',cursor:'pointer'}}><input type="checkbox" checked={form.lookingForFunding} onChange={e=>setForm(f=>({...f,lookingForFunding:e.target.checked}))}/> Seeking funding</label>
            <label style={{display:'flex',gap:'6px',alignItems:'center',fontSize:'13px',cursor:'pointer'}}><input type="checkbox" checked={form.lookingForCoFounders} onChange={e=>setForm(f=>({...f,lookingForCoFounders:e.target.checked}))}/> Seeking co-founders</label>
          </div>
        </div>
        <Btn variant="primary" full style={{marginTop:'14px'}} onClick={createStartup}>Create Startup</Btn>
      </Modal>}
    </Shell>
  )
}
