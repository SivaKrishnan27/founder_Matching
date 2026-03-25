/*import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, Btn, Ico, Tag, Avatar, Modal } from '../components/ui'

export default function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [threads, setThreads] = useState(() => DB.getThreadsForUser(user.id))
  const [selIdx, setSelIdx] = useState(0)
  const [selCF, setSelCF] = useState(null)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)
  const msgEnd = useRef(null)

  const selThread = threads[selIdx]

  useEffect(() => {
    if (selThread) setMsgs(DB.getThread(selThread.key))
  }, [selIdx])

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])

  const send = () => {
    if (!input.trim() || !selThread) return
    DB.sendMessage(selThread.key, user.id, input.trim())
    setMsgs(DB.getThread(selThread.key))
    setThreads(DB.getThreadsForUser(user.id))
    setInput('')
  }

  const selectThread = i => {
    setSelIdx(i)
    const thread = threads[i]
    setMsgs(DB.getThread(thread.key))
    const cf = DB.getCoFounder(thread.cfId)
    setSelCF(cf)
    
    // Mark messages from co-founder as read
    const unreadMessageIds = thread.messages
      .filter(m => m.from !== user.id)
      .map(m => m.id)
    if (unreadMessageIds.length > 0) {
      DB.markMessagesAsRead(user.id, unreadMessageIds)
      // Notify Shell to update unread count
      window.dispatchEvent(new CustomEvent('messagesRead'))
    }
  }

  const startChat = cf => {
    // Since we're already in chat, just close the modal
    setSelCF(null)
  }

  return (
    <Shell title="Founder Chat" subtitle={`${threads.length} conversations`}>
      <div className="content-grid">
        <div style={{
          display:'grid',
          gridTemplateColumns:'280px 1fr',
          background:'var(--card)',
          border:'.5px solid var(--border)',
          borderRadius:'14px',
          overflow:'hidden',
          minHeight:'540px'
        }}>
          {/* Contact list *}
          <div style={{
            borderRight:'.5px solid var(--border)',
            display:'grid',
            gridTemplateRows:'auto 1fr'
          }}>
            <div style={{padding:'12px 12px 9px',borderBottom:'.5px solid var(--border)'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'12px',fontWeight:700,marginBottom:'6px'}}>Messages</div>
              <div style={{fontSize:'11px',color:'var(--muted)'}}>{threads.length} conversation{threads.length!==1?'s':''}</div>
            </div>
            <div style={{overflowY:'auto',padding:'4px'}}>
              {threads.length===0 ? (
              <div style={{padding:'16px',fontSize:'12px',color:'var(--muted)',textAlign:'center'}}>
                No conversations yet.<br/>
                <Btn size="sm" variant="primary" onClick={()=>navigate('/matches')} style={{marginTop:'8px'}}>Find Co-founders</Btn>
              </div>
            ) : threads.map((t,i)=>{
              const cf = DB.getCoFounder(t.cfId)
              if(!cf) return null
              const last = t.messages[t.messages.length-1]
              return (
                <div key={t.key} onClick={()=>selectThread(i)} style={{
                  display:'flex',gap:'8px',padding:'8px',borderRadius:'8px',cursor:'pointer',
                  alignItems:'flex-start',background:selIdx===i?'rgba(91,127,255,.1)':'transparent',
                  transition:'background .15s',
                }}>
                  <Avatar initials={cf.initials} avClass={cf.avClass} size="sm"/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:'12px',fontWeight:600,marginBottom:'1px',fontFamily:"'Syne',sans-serif"}}>{cf.name}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{last?.text||'Start a conversation'}</div>
                  </div>
                  <div style={{fontSize:'10px',color:'var(--muted)',flexShrink:0}}>{last?.ts||''}</div>
                </div>
              )
            })}
          </div>

          {/* Message area *}
          <div style={{display:'flex',flexDirection:'column',minWidth:0}}>
            {selCF ? (
              <>
                <div style={{padding:'11px 14px',borderBottom:'.5px solid var(--border)',display:'flex',alignItems:'center',gap:'9px',flexWrap:'wrap'}}>
                  <Avatar initials={selCF.initials} avClass={selCF.avClass} size="sm"/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:'13px',fontWeight:600, cursor: 'pointer'}} onClick={() => setShowProfileModal(true)}>{selCF.name}</div>
                    <div style={{fontSize:'11px',color:selCF.online?'var(--green)':'var(--muted)',display:'flex',alignItems:'center',gap:'4px'}}>
                      {selCF.online&&<span style={{width:'7px',height:'7px',background:'var(--green)',borderRadius:'50%',display:'inline-block'}}/>}
                      {selCF.online?'Online':'Offline'}
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'6px',flexShrink:0}}>
                    <Tag text={`${selCF.match?.[user.id]||70}% match`} cls="tag-blue"/>
                    <Btn size="sm">Schedule call</Btn>
                  </div>
                </div>

                <div style={{flex:1,padding:'14px',display:'flex',flexDirection:'column',gap:'9px',overflowY:'auto'}}>
                  {msgs.map((m,i)=>{
                    const isMe = m.from === user.id
                    return (
                      <div key={m.id||i} style={{display:'flex',justifyContent:isMe?'flex-end':'flex-start',alignItems:'flex-end',gap:'7px'}}>
                        {!isMe&&<Avatar initials={selCF.initials} avClass={selCF.avClass} size="sm"/>}
                        <div style={{
                          background:isMe?'rgba(91,127,255,.15)':'var(--surface)',
                          border:`.5px solid ${isMe?'rgba(91,127,255,.25)':'var(--border)'}`,
                          borderRadius:isMe?'10px 10px 2px 10px':'10px 10px 10px 2px',
                          padding:'9px 11px',fontSize:'13px',maxWidth:'70%',lineHeight:1.6
                        }}>
                          {m.text}
                          <div style={{fontSize:'10px',color:'var(--muted)',marginTop:'3px',textAlign:'right'}}>{m.ts}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={msgEnd}/>
                </div>

                <div style={{padding:'10px 13px',borderTop:'.5px solid var(--border)',display:'flex',gap:'8px',alignItems:'center'}}>
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                    placeholder="Type a message…"
                    style={{flex:1,background:'var(--surface)',border:'.5px solid var(--border2)',borderRadius:'8px',padding:'8px 11px',color:'var(--text)',fontSize:'13px',fontFamily:"'DM Sans',sans-serif",outline:'none'}}/>
                  <Btn variant="primary" onClick={send}><Ico name="arrow" size={14}/></Btn>
                </div>
              </>
            ) : (
              <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'12px',color:'var(--muted)'}}>
                <Ico name="chat" size={32}/>
                <div style={{fontSize:'13px'}}>Select a conversation</div>
                <Btn variant="primary" size="sm" onClick={()=>navigate('/matches')}>Find Co-founders</Btn>
              </div>
            )}
          </div>
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
}*/
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import DB from '../db'
import Shell from '../components/Shell'
import { Card, Btn, Ico, Tag, Avatar, Modal } from '../components/ui'

export default function Chat() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [threads, setThreads] = useState([])
  const [selIdx, setSelIdx] = useState(0)
  const [selCF, setSelCF] = useState(null)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([])
  const [showProfileModal, setShowProfileModal] = useState(false)

  const msgEnd = useRef(null)

  const selThread = threads[selIdx]

  // ✅ Load threads safely when user is available
  useEffect(() => {
    if (user?.id) {
      const userThreads = DB.getThreadsForUser(user.id) || []
      setThreads(userThreads)
    }
  }, [user])

  // ✅ Set default selected thread + messages
  useEffect(() => {
    if (threads.length > 0 && user?.id) {
      const thread = threads[selIdx] || threads[0]

      setSelIdx(threads.indexOf(thread))

      const messages = DB.getThread(thread.key) || []
      setMsgs(messages)

      const cf = DB.getCoFounder(thread.cfId)
      setSelCF(cf || null)
    } else {
      setMsgs([])
      setSelCF(null)
    }
  }, [threads, user])

  // ✅ Scroll to bottom
  useEffect(() => {
    msgEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  // ✅ Send message safely
  const send = () => {
    if (!input.trim() || !selThread || !user?.id) return

    DB.sendMessage(selThread.key, user.id, input.trim())

    setMsgs(DB.getThread(selThread.key) || [])
    setThreads(DB.getThreadsForUser(user.id) || [])
    setInput('')
  }

  // ✅ Select thread safely
  const selectThread = (i) => {
    if (!user?.id) return

    setSelIdx(i)

    const thread = threads[i]
    if (!thread) return

    setMsgs(DB.getThread(thread.key) || [])

    const cf = DB.getCoFounder(thread.cfId)
    setSelCF(cf || null)

    const unreadMessageIds =
      thread.messages?.filter(m => m.from !== user.id)?.map(m => m.id) || []

    if (unreadMessageIds.length > 0) {
      DB.markMessagesAsRead(user.id, unreadMessageIds)
      window.dispatchEvent(new CustomEvent('messagesRead'))
    }
  }

  const startChat = () => {
    setSelCF(null)
  }

  return (
    <Shell title="Founder Chat" subtitle={`${threads.length} conversations`}>
      <div className="content-grid">
        <div
          className="chat-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            background: 'var(--card)',
            border: '.5px solid var(--border)',
            borderRadius: '14px',
            overflow: 'hidden',
            minHeight: '540px',
          }}
        >
          {/* Sidebar */}
          <div
            className="chat-sidebar"
            style={{
              borderRight: '.5px solid var(--border)',
              display: 'grid',
              gridTemplateRows: 'auto 1fr',
            }}
          >
            <div style={{ padding: '12px 12px 9px', borderBottom: '.5px solid var(--border)', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>Messages</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                {threads.length} conversation{threads.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div style={{ overflowY: 'auto', padding: '4px' }}>
              {threads.length === 0 ? (
                <div style={{ padding: '16px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
                  No conversations yet.<br />
                  <Btn size="sm" variant="primary" onClick={() => navigate('/matches')} style={{ marginTop: '8px' }}>Find Co-founders</Btn>
                </div>
              ) : (
                threads.map((t, i) => {
                  const cf = DB.getCoFounder(t.cfId)
                  if (!cf) return null

                  const last = t.messages?.[t.messages.length - 1]

                  return (
                    <div
                      key={t.key}
                      onClick={() => selectThread(i)}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        alignItems: 'flex-start',
                        background: selIdx === i ? 'rgba(91,127,255,.1)' : 'transparent',
                        transition: 'background .15s',
                      }}
                    >
                      <Avatar initials={cf.initials} avClass={cf.avClass} size="sm" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '1px', fontFamily: "'Syne',sans-serif" }}>{cf.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {last?.text || 'Start a conversation'}
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', flexShrink: 0 }}>{last?.ts || ''}</div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-main" style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {selCF ? (
              <>
                <div style={{ padding: '11px 14px', borderBottom: '.5px solid var(--border)', display: 'flex', alignItems: 'center', gap: '9px', flexWrap: 'wrap', flexShrink: 0 }}>
                  <Avatar initials={selCF.initials} avClass={selCF.avClass} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: 600 }}>{selCF.name}</div>
                    <div style={{ fontSize: '11px', color: selCF.online ? 'var(--green)' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {selCF.online && <span style={{ width: '7px', height: '7px', background: 'var(--green)', borderRadius: '50%', display: 'inline-block' }} />}
                      {selCF.online ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <Tag text={`${selCF.match?.[user?.id] || 70}% match`} cls="tag-blue" />
                    <Btn size="sm">Schedule call</Btn>
                    <Btn size="sm" variant="primary" onClick={() => navigate('/matches')}>View profile</Btn>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '14px', display: 'flex', flexDirection: 'column', gap: '9px', overflowY: 'auto' }}>
                  {msgs.map((m, i) => {
                    const isMe = m.from === user?.id
                    return (
                      <div key={m.id || i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '7px' }}>
                        {!isMe && <Avatar initials={selCF.initials} avClass={selCF.avClass} size="sm" />}
                        <div style={{
                          background: isMe ? 'rgba(91,127,255,.15)' : 'var(--surface)',
                          border: `.5px solid ${isMe ? 'rgba(91,127,255,.25)' : 'var(--border)'}`,
                          borderRadius: isMe ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                          padding: '9px 11px',
                          fontSize: '13px',
                          maxWidth: '70%',
                          lineHeight: 1.6
                        }}>
                          {m.text}
                          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '3px', textAlign: 'right' }}>{m.ts}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={msgEnd} />
                </div>

                <div style={{ padding: '10px 13px', borderTop: '.5px solid var(--border)', display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    placeholder="Type a message…"
                    style={{
                      flex: 1,
                      background: 'var(--surface)',
                      border: '.5px solid var(--border2)',
                      borderRadius: '8px',
                      padding: '8px 11px',
                      color: 'var(--text)',
                      fontSize: '13px',
                      fontFamily: "'DM Sans',sans-serif",
                      outline: 'none'
                    }}
                  />
                  <Btn variant="primary" onClick={send}><Ico name="arrow" size={14} /></Btn>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--muted)' }}>
                <Ico name="chat" size={32} />
                <div style={{ fontSize: '13px' }}>Select a conversation</div>
                <Btn variant="primary" size="sm" onClick={() => navigate('/matches')}>Find Co-founders</Btn>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfileModal && selCF && (
        <Modal title="Co-founder Profile" onClose={() => setShowProfileModal(false)} large>
          <div style={{display:'flex',gap:'14px',alignItems:'flex-start',marginBottom:'16px',flexWrap:'wrap'}}>
            <Avatar initials={selCF.initials} avClass={selCF.avClass} size="lg"/>
            <div style={{flex:1,minWidth:'180px'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:'18px',fontWeight:800,marginBottom:'3px'}}>{selCF.name}</div>
              <div style={{fontSize:'12px',color:'var(--muted)',marginBottom:'8px'}}>{selCF.role} · {selCF.city}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'5px'}}>{(selCF.tags||[]).map((t,i)=><Tag key={t} text={t} cls={(selCF.tagClasses||[])[i]||'tag-gray'}/>)}<Tag text={`${selCF.match?.[user.id]||75}% match`} cls="tag-blue"/></div>
            </div>
            <Btn variant="primary" onClick={() => setShowProfileModal(false)}><Ico name="chat" size={12}/> Back to Chat</Btn>
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
