import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import {
  Card, CardHeader, CardTitle, Btn, Ico, Tag, Avatar,
  FounderCard, IdeaCard, Sparkline, ScoreRing, ProgressBar,
  MilestoneStep, AiTip, MetricCard, Modal, OnlineDot,
} from '../components/ui'

function IdeaDetailModal({ idea, onClose }) {
  const allUsers = DB.getAllUsers()
  const poster = allUsers.find(u => u.id === idea.postedBy)
  return (
    <Modal title="Startup Idea Details" onClose={onClose} large>
      <div style={{display:'flex',gap:'12px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
        <div style={{fontSize:'40px',lineHeight:1}}>{idea.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'19px',fontWeight:800,marginBottom:'7px'}}>{idea.title}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            <Tag text={idea.tag} cls={idea.tagClass}/>
            <Tag text={idea.stage} cls="tag-gray"/>
            <Tag text={`${idea.looking} looking`} cls="tag-blue"/>
            <Tag text={`${idea.saves} saves`} cls="tag-amber"/>
          </div>
        </div>
      </div>
      {poster && (
        <div style={{display:'flex',gap:'10px',alignItems:'center',padding:'10px 12px',background:'var(--surface)',borderRadius:'10px',marginBottom:'14px',flexWrap:'wrap'}}>
          <Avatar initials={poster.initials} avClass={poster.avClass} size="sm"/>
          <div>
            <div style={{fontSize:'12px',fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{poster.name}</div>
            <div style={{fontSize:'11px',color:'var(--muted)'}}>{poster.role} · {poster.city}</div>
          </div>
          <Tag text="Posted by" cls="tag-gray"/>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'14px'}}>
        {[['Problem',idea.problem,'var(--coral)'],['Solution',idea.solution,'var(--green)'],['Market',idea.market,'var(--amber)'],['Traction',idea.traction,'var(--acc)']].map(([h,t,c])=>(
          <Card key={h} style={{padding:'12px'}}>
            <div style={{fontSize:'10px',color:c,textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif",marginBottom:'5px'}}>{h}</div>
            <div style={{fontSize:'12px',color:'var(--muted)',lineHeight:1.6}}>{t||'—'}</div>
          </Card>
        ))}
      </div>
      {idea.fullDesc && (
        <Card style={{marginBottom:'14px'}}>
          <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Full Description</div>
          <div style={{fontSize:'13px',lineHeight:1.8,color:'var(--muted)'}}>{idea.fullDesc}</div>
        </Card>
      )}
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

function CoFounderModal({ cf, user, onClose }) {
  const navigate = useNavigate()
  const startChat = () => {
    DB.startThread(user.id, cf.id, `Hi ${cf.name.split(' ')[0]}! I'd love to connect as co-founders.`)
    navigate('/chat')
    onClose()
  }
  return (
    <Modal title="Co-founder Profile" onClose={onClose} large>
      <div style={{display:'flex',gap:'14px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
        <Avatar initials={cf.initials} avClass={cf.avClass} size="lg"/>
        <div style={{flex:1,minWidth:'200px'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'19px',fontWeight:800,marginBottom:'4px'}}>
            {cf.name}{cf.online&&<OnlineDot style={{marginLeft:8}}/>}
          </div>
          <div style={{fontSize:'13px',color:'var(--muted)',marginBottom:'8px'}}>{cf.role} · {cf.city}</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'8px'}}>
            {(cf.tags||[]).map((t,i)=><Tag key={t} text={t} cls={(cf.tagClasses||[])[i]||'tag-gray'}/>)}
          </div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
            <Tag text={`${cf.dynamicMatch || cf.match?.[user.id] || 75}% match`} cls="tag-blue"/>
            {cf.openToEquity&&<Tag text="Open to equity" cls="tag-green"/>}
            {cf.partTime&&<Tag text="Part-time ok" cls="tag-amber"/>}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'7px',flexShrink:0}}>
          <Btn variant="primary" onClick={startChat}><Ico name="chat" size={12}/> Message</Btn>
          {cf.linkedIn&&<a href={cf.linkedIn} target="_blank" rel="noreferrer" className="btn" style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 13px',background:'rgba(255,255,255,.05)',border:'.5px solid rgba(255,255,255,.13)',borderRadius:'8px',color:'var(--text)',fontSize:'12px',textDecoration:'none'}}><Ico name="link" size={12}/> LinkedIn</a>}
        </div>
      </div>
      <Card style={{marginBottom:'12px'}}>
        <div style={{fontSize:'13px',lineHeight:1.8,color:'var(--muted)'}}>{cf.bio||'No bio yet.'}</div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
        <Card>
          <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Background</div>
          {[['Experience',cf.experience||'—'],['Prev Startups',cf.prevStartups||0],['City',cf.city||'—']].map(([l,v])=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',padding:'4px 0',borderBottom:'.5px solid var(--border)'}}>
              <span style={{color:'var(--muted)'}}>{l}</span><strong>{v}</strong>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif"}}>Skills</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>
            {(cf.skills||[]).map(s=><Tag key={s} text={s} cls="tag-gray"/>)}
          </div>
        </Card>
      </div>
    </Modal>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const analytics = DB.getAnalytics(user.id)
  const milestones = DB.getMilestones(user.id)
  const allFounders = DB.getCoFounders()
  const ideas = DB.getIdeas().slice(0,4)
  const [selIdea, setSelIdea] = useState(null)
  const [selCF, setSelCF] = useState(null)

  const userIdeas = DB.getIdeasForUser(user.id)
  const primaryIdea = userIdeas[0]

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

  const founders = allFounders.map(f => ({
    ...f,
    dynamicMatch: calculateMatch(primaryIdea, f)
  })).sort((a,b)=>b.dynamicMatch - a.dynamicMatch).slice(0,3)

  const startChat = cf => {
    const templates = [
      `Hi ${cf.name.split(' ')[0]}! I'd love to connect.`,
      `Hi ${cf.name.split(' ')[0]}! Saw your profile — impressive background in ${cf.role}.`,
      `Hi ${cf.name.split(' ')[0]}! Your ${cf.experience} years of experience is exactly what I'm looking for.`,
    ]
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    DB.startThread(user.id, cf.id, randomTemplate)
    navigate('/chat')
  }

  return (
    <Shell title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'User'} 👋`}>
      <div className="content-grid">
        {/* Welcome Banner */}
        <div style={{background:'linear-gradient(135deg,rgba(91,127,255,.12),rgba(167,139,250,.07))',border:'.5px solid rgba(91,127,255,.22)',borderRadius:'14px',padding:'18px 22px',display:'grid',gridTemplateColumns:'1fr auto',gap:'14px',alignItems:'center',animation:'fadeUp .4s ease both'}}>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:'17px',fontWeight:800,marginBottom:'4px'}}>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</div>
            <div style={{fontSize:'13px',color:'var(--muted)'}}>You have <strong style={{color:'var(--text)'}}>3 new match suggestions</strong> and <strong style={{color:'var(--text)'}}>2 unread messages</strong> waiting.</div>
          </div>
          <Btn variant="primary" onClick={()=>navigate('/matches')}>View matches →</Btn>
        </div>

        {/* Metrics */}
        <div className="grid-cols-4 gap-10" data-grid="metrics">
          <MetricCard label="Profile Views" value={analytics.metrics.profileViews.toLocaleString()} sub={<><span style={{color:'var(--green)'}}>{analytics.trends.profileViews}</span> vs last month</>} colorClass="m-blue" delay={.05}/>
          <MetricCard label="Connections" value={analytics.metrics.connects} sub={<><span style={{color:'var(--green)'}}>{analytics.trends.connects}</span> this month</>} colorClass="m-green" delay={.1}/>
          <MetricCard label="Idea Saves" value={analytics.metrics.ideaSaves} sub={<><span style={{color:'var(--green)'}}>{analytics.trends.ideaSaves}</span> this week</>} colorClass="m-amber" delay={.15}/>
          <MetricCard label="Chat Opens" value={analytics.metrics.chatOpens} sub={<><span style={{color:'var(--green)'}}>{analytics.trends.chatOpens}</span> this month</>} colorClass="m-coral" delay={.2}/>
        </div>

        {/* Two-column */}
        <div className="content-grid-2col">
          <div className="page-section">
            {/* Top Matches */}
            <Card>
              <CardHeader>
                <CardTitle>Top co-founder matches</CardTitle>
                <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'6px', alignItems:'center'}}>
                  <Tag text="AI powered" cls="tag-blue"/>
                  <Btn size="sm" onClick={()=>navigate('/matches')}>View more</Btn>
                </div>
              </CardHeader>
              <div className="grid-auto-fit">
                {founders.map(f=><FounderCard key={f.id} cf={f} matchPct={f.dynamicMatch} onView={setSelCF} onChat={startChat}/>)}
              </div>
            </Card>

            {/* Trending Ideas */}
            <Card>
              <CardHeader><CardTitle>Trending startup ideas</CardTitle><Btn size="sm" onClick={()=>navigate('/ideas')}>Browse all</Btn></CardHeader>
              <div className="grid-cols-2 gap-9">
                {ideas.map(i=><IdeaCard key={i.id} idea={i} onView={setSelIdea}/>)}
              </div>
            </Card>

            {/* Sparkline */}
            <Card>
              <CardHeader><CardTitle>Profile activity</CardTitle><span style={{fontSize:'11px',color:'var(--muted)'}}>Views per day</span></CardHeader>
              <Sparkline data={analytics.sparkData}/>
            </Card>
          </div>

          <div className="page-section">
            {/* Investor Readiness */}
            <Card>
              <CardHeader><CardTitle>Investor readiness</CardTitle><Btn size="sm" onClick={()=>navigate('/investors')}>Full report</Btn></CardHeader>
              <div className="page-section">
                <ScoreRing score={analytics.profileScore}/>
                <div className="grid-auto-fit">
                  <ProgressBar label="Team" value={85} color="var(--green)"/>
                  <ProgressBar label="Product" value={70} color="var(--acc)"/>
                  <ProgressBar label="Market" value={65} color="var(--amber)"/>
                  <ProgressBar label="Traction" value={55} color="var(--coral)"/>
                </div>
              </div>
              <AiTip style={{marginTop:'12px'}}>
                <strong>AI tip:</strong> Add pilot customer data to push traction above 75 and unlock more investor matches.
              </AiTip>
            </Card>

            {/* Milestones */}
            <Card>
              <CardHeader><CardTitle>Startup progress</CardTitle><Btn size="sm" onClick={()=>navigate('/progress')}>Details</Btn></CardHeader>
              <div style={{display:'grid', gridTemplateColumns:'1fr', gap:'0'}}>
                {milestones.map((s,i)=><MilestoneStep key={i} s={s}/>)}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
              <div className="grid-cols-2 gap-8">
                <Btn variant="primary" full onClick={()=>navigate('/matches')}>Find Co-founders</Btn>
                <Btn full onClick={()=>navigate('/investors')}>Investor Radar</Btn>
                <Btn full onClick={()=>navigate('/my-startups')}>My Startups</Btn>
                <Btn full onClick={()=>navigate('/investor-match')}>Investor Match</Btn>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {selIdea && <IdeaDetailModal idea={selIdea} onClose={()=>setSelIdea(null)}/>}
      {selCF && <CoFounderModal cf={selCF} user={user} onClose={()=>setSelCF(null)}/>}
    </Shell>
  )
}
