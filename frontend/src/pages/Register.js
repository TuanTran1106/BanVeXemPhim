
import React, { useState } from 'react';
import { register } from '../services/authService';
import { Link } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register({ email, password, fullName });
            if (res.data && res.data.id) {
                setSuccess('Đăng ký thành công!');
                setError('');
            } else {
                setError('Đăng ký thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối backend');
        }
    };

    return (
        <div style={{maxWidth:'400px',margin:'40px auto',padding:'32px',borderRadius:'10px',background:'#f5faff',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
            <h2 style={{color:'#1976d2',marginBottom:'24px',textAlign:'center'}}>Đăng ký tài khoản</h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <input type="text" placeholder="Tên" value={fullName} onChange={e => setFullName(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #1976d2'}} />
                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #1976d2'}} />
                <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required style={{padding:'10px',borderRadius:'6px',border:'1px solid #1976d2'}} />
                <button type="submit" style={{background:'#1976d2',color:'#fff',padding:'10px',border:'none',borderRadius:'6px',fontWeight:'bold',marginTop:'8px'}}>Đăng ký</button>
            </form>
            <div style={{marginTop:'16px',textAlign:'center'}}>
                <span>Đã có tài khoản? <Link to="/login" style={{color:'#1976d2',textDecoration:'underline'}}>Đăng nhập</Link></span>
            </div>
            {error && <p style={{color:'red',marginTop:'12px',textAlign:'center'}}>{error}</p>}
            {success && <p style={{color:'green',marginTop:'12px',textAlign:'center'}}>{success}</p>}
        </div>
    );
}

export default Register;
