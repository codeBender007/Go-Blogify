import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'

export default function EditBlog(){
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [err, setErr] = useState('')
  const { token } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    api.get('/blogs/' + id).then(res => {
      setTitle(res.data.blog.title)
      setContent(res.data.blog.content)
    })
  }, [id])

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await api.put('/blogs/'+id, { title, content }, { headers: { Authorization: 'Bearer ' + token }})
      nav('/blogs/'+id)
    }catch(e){ setErr(e.response?.data?.error || 'Error updating') }
  }

  return (
    <div className="grid" style={{maxWidth:700, margin:'24px auto'}}>
      <h2 className="header">Edit Blog</h2>
      {err && <div className="card" style={{borderColor:'#fecaca'}}>⚠ {err}</div>}
      <form className="grid" onSubmit={submit}>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea rows="10" value={content} onChange={e=>setContent(e.target.value)} />
        <button className="btn primary">Save</button>
      </form>
    </div>
  )
}
