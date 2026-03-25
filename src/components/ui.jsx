// ================================================================
// FOUNDERMATCH — Shared UI Primitives
// ================================================================
import { useState, useEffect, useRef, useCallback } from 'react'

// ── THEME INJECTION ──────────────────────────────────────────
export function useTheme(accentColor = '#5b7fff') {
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--acc', accentColor)
    const r = parseInt(accentColor.slice(1,3),16)
    const g = parseInt(accentColor.slice(3,5),16)
    const b = parseInt(accentColor.slice(5,7),16)
    root.style.setProperty('--acc-rgb', `${r},${g},${b}`)
  }, [accentColor])
}

// ── ICONS ─────────────────────────────────────────────────────
export const ICONS = {
  logo:      <>
    <circle cx="6" cy="5" r="2.5" fill="white"/>
    <circle cx="11" cy="8" r="2" fill="white" opacity=".7"/>
    <path d="M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
  </>,
  dashboard: <><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill="currentColor"/></>,
  matches:   <><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  ideas:     <path d="M8 1.5L9.8 6.2H14.8L10.8 9L12.3 13.8L8 11L3.7 13.8L5.2 9L1.2 6.2H6.2L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>,
  skills:    <><circle cx="5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 7L9 6M7.5 9L9 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  chat:      <path d="M14 10c0 .8-.6 1.5-1.5 1.5H4L1.5 14V3.5C1.5 2.7 2.2 2 3 2h9.5c.8 0 1.5.7 1.5 1.5V10z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>,
  mystartups:<path d="M2 12V4l6-2.5L14 4v8l-6 2.5L2 12z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>,
  progress:  <path d="M2 10l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>,
  investors: <><path d="M13 6c0 4-5 8-5 8S3 10 3 6a5 5 0 0110 0z" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="6" r="1.5" fill="currentColor"/></>,
  imatch:    <path d="M8 2L9.5 6.5H14L10.3 9.1L11.8 13.5L8 11L4.2 13.5L5.7 9.1L2 6.5H6.5L8 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>,
  analytics: <><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  profile:   <><circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  menu:      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  close:     <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  search:    <><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
  bell:      <><path d="M8 1.5a4.5 4.5 0 014.5 4.5c0 2.5.8 3.5 1.5 4H2c.7-.5 1.5-1.5 1.5-4A4.5 4.5 0 018 1.5z" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 13.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  plus:      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  edit:      <path d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>,
  trash:     <><path d="M3 5h10M8 8v5M6 8v5M4 5l.8 9h6.4L12 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 5V3h4v2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></>,
  arrow:     <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>,
  back:      <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>,
  link:      <><path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5L7 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5L9 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></>,
  check:     <path d="M1.5 5l2.5 2.5 4.5-5" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
}

export function Ico({ name, size = 16, style, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={style} className={className}>
      {ICONS[name]}
    </svg>
  )
}

// ── AVATAR ─────────────────────────────────────────────────────
const AV_SIZES = { sm:'28px', md:'34px', lg:'46px', xl:'60px' }
const AV_FONT  = { sm:'10px', md:'12px', lg:'16px', xl:'20px' }

export function Avatar({ initials, avClass, size = 'md', style: extraStyle }) {
  return (
    <div className={`avatar ${avClass}`} style={{
      width:AV_SIZES[size], height:AV_SIZES[size],
      fontSize:AV_FONT[size], borderRadius:'50%',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Syne',sans-serif", fontWeight:700, flexShrink:0,
      ...extraStyle
    }}>
      {initials}
    </div>
  )
}

// ── TAG ────────────────────────────────────────────────────────
export function Tag({ text, cls, style: extraStyle }) {
  return (
    <span className={`tag ${cls}`} style={{
      display:'inline-flex', alignItems:'center',
      fontSize:'10px', padding:'3px 8px', borderRadius:'20px',
      fontWeight:600, fontFamily:"'Syne',sans-serif",
      letterSpacing:'.3px', whiteSpace:'nowrap',
      ...extraStyle
    }}>
      {text}
    </span>
  )
}

// ── BUTTON ─────────────────────────────────────────────────────
export function Btn({ children, variant='default', size='md', full=false, onClick, disabled, type='button', style:ex, className='' }) {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'5px',
    borderRadius:'8px', fontFamily:"'DM Sans',sans-serif", cursor:disabled?'not-allowed':'pointer',
    border:'none', transition:'all .15s', whiteSpace:'nowrap',
    padding: size==='sm' ? '4px 9px' : '7px 13px',
    fontSize: size==='sm' ? '11px' : '12px',
    width: full ? '100%' : undefined,
    opacity: disabled ? .6 : 1,
  }
  const variants = {
    default: { background:'rgba(255,255,255,.05)', border:'.5px solid rgba(255,255,255,.13)', color:'var(--text)' },
    primary: { background:'var(--acc)', border:'.5px solid var(--acc)', color:'#fff' },
    danger:  { background:'rgba(251,113,133,.1)', border:'.5px solid rgba(251,113,133,.3)', color:'var(--coral)' },
    ghost:   { background:'transparent', border:'none', color:'var(--muted)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}
      style={{...base,...variants[variant],...ex}}>
      {children}
    </button>
  )
}

// ── CARD ───────────────────────────────────────────────────────
export function Card({ children, style: ex, className='' }) {
  return (
    <div className={className} style={{
      background:'var(--card)', border:'.5px solid var(--border)',
      borderRadius:'14px', padding:'15px', ...ex
    }}>
      {children}
    </div>
  )
}

export function CardHeader({ children }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',gap:'8px',flexWrap:'wrap'}}>
      {children}
    </div>
  )
}

export function CardTitle({ children }) {
  return <span style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:700}}>{children}</span>
}

// ── INPUT ──────────────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type='text', style:ex, multiline=false, rows=3, id, required }) {
  const base = {
    background:'var(--surface)', border:'.5px solid var(--border2)',
    borderRadius:'8px', padding:'8px 11px', color:'var(--text)',
    fontSize:'13px', fontFamily:"'DM Sans',sans-serif",
    outline:'none', width:'100%', ...ex
  }
  if (multiline) return (
    <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{...base,resize:'vertical',minHeight:`${rows*26}px`}}/>
  )
  return (
    <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
      required={required} style={base}/>
  )
}

export function Select({ value, onChange, options, style:ex }) {
  return (
    <select value={value} onChange={onChange} style={{
      background:'var(--surface)', border:'.5px solid var(--border2)',
      borderRadius:'8px', padding:'8px 11px', color:'var(--text)',
      fontSize:'13px', fontFamily:"'DM Sans',sans-serif",
      outline:'none', width:'100%', cursor:'pointer', ...ex
    }}>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}

export function Label({ children }) {
  return (
    <div style={{fontSize:'10px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif",marginBottom:'5px'}}>
      {children}
    </div>
  )
}

export function Field({ label, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// ── MODAL ──────────────────────────────────────────────────────
export function Modal({ title, onClose, children, large = false }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,.78)',zIndex:200,
      display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'
    }}>
      <div style={{
        background:'var(--card)', border:'.5px solid var(--border2)',
        borderRadius:'16px', padding:'22px',
        width:'100%', maxWidth:large?'740px':'540px',
        maxHeight:'92vh', overflowY:'auto',
        animation:'fadeUp .25s ease both'
      }}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:'15px',fontWeight:700}}>{title}</div>
          <Btn size="sm" onClick={onClose}><Ico name="close" size={13}/></Btn>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── SCORE RING ─────────────────────────────────────────────────
export function ScoreRing({ score, size = 84 }) {
  const inner = Math.round(size * .77)
  const r = size/2 - 4.5
  const cx = size/2, cy = size/2
  const circ = 2 * Math.PI * r
  const fill = (score/100) * circ
  return (
    <div style={{position:'relative',width:size,height:size,flexShrink:0}}>
      <svg style={{transform:'rotate(-90deg)',display:'block'}} viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--acc)" strokeWidth="6"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
        width:inner,height:inner,borderRadius:'50%',background:'var(--card)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:'var(--acc)',lineHeight:1,fontSize:Math.round(size*.21)}}>{score}</div>
        <div style={{fontSize:'9px',color:'var(--muted)',textTransform:'uppercase'}}>/100</div>
      </div>
    </div>
  )
}

// ── PROGRESS BAR ───────────────────────────────────────────────
export function ProgressBar({ label, value, color = 'var(--acc)', style:ex }) {
  return (
    <div style={{...ex}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:'12px',color:'var(--muted)',marginBottom:'3px'}}>
        <span>{label}</span><span style={{color}}>{value}%</span>
      </div>
      <div style={{height:'5px',background:'rgba(255,255,255,.06)',borderRadius:'99px',overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:'99px',background:color,width:`${value}%`,transition:'width 1s ease'}}/>
      </div>
    </div>
  )
}

// ── MINI BAR ───────────────────────────────────────────────────
export function MiniBar({ value }) {
  return (
    <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'99px',overflow:'hidden'}}>
      <div style={{height:'100%',borderRadius:'99px',background:'var(--acc)',width:`${value}%`}}/>
    </div>
  )
}

// ── SPARKLINE ──────────────────────────────────────────────────
export function Sparkline({ data, height = 44 }) {
  const labels = ['Feb 14','Feb 21','Feb 28','Mar 7','Mar 15']
  return (
    <>
      <div style={{display:'flex',alignItems:'flex-end',gap:'2px',height}}>
        {data.map((v,i) => (
          <div key={i} style={{
            flex:1, borderRadius:'2px 2px 0 0',
            background: v>75 ? 'rgba(91,127,255,.42)' : 'rgba(91,127,255,.22)',
            minHeight:'3px', height:`${v}%`,
            transition:'background .15s', cursor:'pointer',
          }}/>
        ))}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'var(--muted)',marginTop:'4px'}}>
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </>
  )
}

// ── MILESTONE STEP ─────────────────────────────────────────────
export function MilestoneStep({ s }) {
  const dotStyles = {
    done:   { background:'rgba(52,211,153,.14)', color:'var(--green)', border:'1px solid rgba(52,211,153,.3)' },
    active: { background:'rgba(91,127,255,.14)', color:'var(--acc)',   border:'1px solid rgba(91,127,255,.4)' },
    todo:   { background:'transparent',          color:'var(--muted)', border:'1px solid rgba(255,255,255,.13)' },
  }
  return (
    <div style={{display:'flex',gap:'10px',paddingBottom:'14px',position:'relative'}}>
      <div style={{position:'relative',zIndex:1}}>
        <div style={{width:'22px',height:'22px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',fontWeight:700,flexShrink:0,...dotStyles[s.state]}}>
          {s.n}
        </div>
      </div>
      <div style={{flex:1,paddingTop:'1px'}}>
        <div style={{fontSize:'12px',fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:'1px',
          opacity:s.state==='todo'?.45:1, color:s.state==='active'?'var(--acc)':undefined}}>
          {s.title}
        </div>
        <div style={{fontSize:'11px',color:'var(--muted)',lineHeight:1.5,opacity:s.state==='todo'?.35:1}}>
          {s.desc}
        </div>
        {s.progress !== undefined && (
          <div style={{height:'4px',background:'rgba(255,255,255,.06)',borderRadius:'99px',overflow:'hidden',marginTop:'5px'}}>
            <div style={{height:'100%',borderRadius:'99px',background:'var(--acc)',width:`${s.progress}%`}}/>
          </div>
        )}
      </div>
    </div>
  )
}

// ── AI TIP ─────────────────────────────────────────────────────
export function AiTip({ children }) {
  return (
    <div style={{background:'rgba(91,127,255,.07)',border:'.5px solid rgba(91,127,255,.2)',borderRadius:'8px',padding:'10px 12px',fontSize:'12px',color:'var(--muted)',lineHeight:1.6}}>
      {children}
    </div>
  )
}

// ── TOAST ──────────────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState(null)
  const show = useCallback((msg, type='success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2600)
  }, [])
  return { toast, show }
}

export function Toast({ toast }) {
  if (!toast) return null
  const bg = toast.type==='success' ? 'var(--green)' : toast.type==='error' ? 'var(--coral)' : 'var(--acc)'
  return (
    <div style={{position:'fixed',bottom:'90px',right:'20px',zIndex:999,background:bg,color:'#000',
      fontFamily:"'Syne',sans-serif",fontSize:'12px',fontWeight:600,padding:'10px 16px',
      borderRadius:'9px',animation:'fadeUp .25s ease',boxShadow:'0 4px 20px rgba(0,0,0,.4)'}}>
      {toast.msg}
    </div>
  )
}

// ── ONLINE DOT ─────────────────────────────────────────────────
export function OnlineDot({ style:ex }) {
  return <span style={{width:'7px',height:'7px',background:'var(--green)',borderRadius:'50%',display:'inline-block',...ex}}/>
}

// ── SECTION ROW ────────────────────────────────────────────────
export function SectionRow({ label, children }) {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'8px'}}>
      <span style={{fontSize:'11px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif'"}}>
        {label}
      </span>
      <div style={{display:'flex',gap:'6px',flexWrap:'wrap',alignItems:'center'}}>{children}</div>
    </div>
  )
}

// ── SKILL TAG FILTER ───────────────────────────────────────────
export function SkillTag({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      fontSize:'11px', padding:'4px 10px', borderRadius:'20px', cursor:'pointer',
      border:`.5px solid ${active?'var(--acc)':'rgba(255,255,255,.13)'}`,
      color: active ? 'var(--acc)' : 'var(--muted)',
      background: active ? 'rgba(91,127,255,.08)' : 'transparent',
      fontFamily:"'DM Sans',sans-serif", transition:'all .15s',
    }}>
      {label}
    </button>
  )
}

// ── FOUNDER CARD ───────────────────────────────────────────────
export function FounderCard({ cf, matchPct, onView, onChat }) {
  if (!cf) return null
  return (
    <div onClick={()=>onView?.(cf)} style={{
      background: cf.featured ? 'linear-gradient(135deg,rgba(91,127,255,.07),rgba(167,139,250,.04))' : 'var(--surface)', border:`.5px solid ${cf.featured?'rgba(91,127,255,.3)':'var(--border)'}`,
      borderRadius:'12px', padding:'13px', display:'flex', gap:'11px',
      alignItems:'flex-start', cursor:'pointer', transition:'all .15s',
      animation:'fadeUp .3s ease both',
    }}>
      <Avatar initials={cf.initials} avClass={cf.avClass}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:700,marginBottom:'1px',display:'flex',alignItems:'center',gap:'5px'}}>
          {cf.name}{cf.online&&<OnlineDot/>}
        </div>
        <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'6px'}}>{cf.role} · {cf.city}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'3px',marginBottom:'5px'}}>
          {(cf.tags||[]).map((t,i)=><Tag key={t} text={t} cls={(cf.tagClasses||[])[i]||'tag-gray'}/>)}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'3px',flexShrink:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:800,color:'var(--acc)'}}>{matchPct}%</div>
        <div style={{fontSize:'9px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.6px'}}>match</div>
        <Btn size="sm" variant={cf.featured?'primary':'default'} onClick={e=>{e.stopPropagation();onChat?.(cf)}}>
          <Ico name="chat" size={11}/> Chat
        </Btn>
      </div>
    </div>
  )
}

// ── IDEA CARD ──────────────────────────────────────────────────
export function IdeaCard({ idea, onView }) {
  return (
    <div onClick={()=>onView?.(idea)} style={{
      background:'var(--surface)', border:'.5px solid var(--border)',
      borderRadius:'12px', padding:'13px', cursor:'pointer', transition:'all .15s',
    }}>
      <div style={{fontSize:'22px',marginBottom:'7px'}}>{idea.emoji}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:700,marginBottom:'3px'}}>{idea.title}</div>
      <div style={{fontSize:'11px',color:'var(--muted)',lineHeight:1.6,marginBottom:'8px'}}>{idea.shortDesc}</div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Tag text={idea.tag} cls={idea.tagClass}/>
        <div style={{display:'flex',gap:'7px',alignItems:'center'}}>
          <span style={{fontSize:'10px',color:'var(--muted)'}}>{idea.looking} looking</span>
          <Btn size="sm" onClick={e=>{e.stopPropagation();onView?.(idea)}}>View →</Btn>
        </div>
      </div>
    </div>
  )
}

// ── INVESTOR ITEM ──────────────────────────────────────────────
export function InvestorItem({ inv, userId, onClick }) {
  const fit = inv.fit?.[userId] || 70
  const fitColor = fit>=85 ? 'var(--green)' : fit>=70 ? 'var(--acc)' : fit>=55 ? 'var(--amber)' : 'var(--coral)'
  return (
    <div onClick={onClick} style={{
      background:'var(--surface)', border:'.5px solid var(--border)',
      borderRadius:'10px', padding:'12px', display:'flex', alignItems:'center',
      gap:'10px', cursor:'pointer', transition:'border-color .15s',
    }}>
      <Avatar initials={inv.initials} avClass={inv.avClass}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'13px',fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:'1px'}}>{inv.name}</div>
        <div style={{fontSize:'11px',color:'var(--muted)',marginBottom:'4px'}}>{inv.focus}</div>
        <div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>
          <Tag text={inv.stage||'—'} cls="tag-gray"/>
          <Tag text={inv.ticketSize||'—'} cls="tag-teal"/>
          <Tag text={inv.type||'VC'} cls="tag-purple"/>
        </div>
      </div>
      <div style={{textAlign:'right',flexShrink:0}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:'16px',fontWeight:800,color:fitColor}}>{fit}%</div>
        <div style={{fontSize:'9px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',marginBottom:'4px'}}>fit</div>
        <Btn size="sm" variant="primary" onClick={e=>{e.stopPropagation();onClick?.()}}>View more</Btn>
      </div>
    </div>
  )
}

// ── METRIC CARD ────────────────────────────────────────────────
export function MetricCard({ label, value, sub, colorClass, delay=0 }) {
  const barColor = {
    'm-blue':'var(--acc)', 'm-green':'var(--green)',
    'm-amber':'var(--amber)', 'm-coral':'var(--coral)',
    'm-teal':'var(--teal)', 'm-purple':'var(--purple)',
  }[colorClass]||'var(--acc)'
  return (
    <div style={{
      background:'var(--card)', border:'.5px solid var(--border)',
      borderRadius:'12px', padding:'14px', position:'relative',
      overflow:'hidden', cursor:'pointer', transition:'all .15s',
      animation:`fadeUp .4s ease ${delay}s both`,
    }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'2.5px',background:barColor}}/>
      <div style={{fontSize:'10px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.8px',fontFamily:"'Syne',sans-serif",marginBottom:'2px'}}>{label}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:'26px',fontWeight:800,lineHeight:1,marginBottom:'4px',color:barColor}}>{value}</div>
      <div style={{fontSize:'11px',color:'var(--muted)'}}>{sub}</div>
    </div>
  )
}
