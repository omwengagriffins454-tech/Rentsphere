import React, {useState} from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate = useNavigate()
  const handle = async (e)=>{
    e.preventDefault()
    try{
      await signInWithEmailAndPassword(auth,email,password)
      navigate('/dashboard')
    }catch(err){
      alert(err.message)
    }
  }
  return (
    <div style={{maxWidth:600}}>
      <h2>Login</h2>
      <form onSubmit={handle}>
        <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"/>
        <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/>
        <button className="btn" style={{marginTop:8}}>Login</button>
      </form>
    </div>
  )
}