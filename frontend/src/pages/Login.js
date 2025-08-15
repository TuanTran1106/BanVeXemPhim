import React, { useState } from 'react';
import { login } from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await login({ email, password });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem('role', res.data.role);
                if (onLoginSuccess) onLoginSuccess(res.data.user, res.data.role);
                alert('Đăng nhập thành công!');
                navigate('/'); // Redirect về trang home
            } else {
                setError(res.data.error || 'Đăng nhập thất bại');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Lỗi kết nối server');
            }
        }
    };

    return (
        <div style={{maxWidth:'400px',margin:'40px auto',padding:'32px',borderRadius:'10px',background:'#f5faff',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
            <h2 style={{color:'#1976d2',marginBottom:'24px',textAlign:'center'}}>Đăng nhập</h2>
            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    style={{padding:'10px',borderRadius:'6px',border:'1px solid #1976d2'}} 
                />
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{padding:'10px',borderRadius:'6px',border:'1px solid #1976d2'}} 
                />
                <button 
                    type="submit" 
                    style={{background:'#1976d2',color:'#fff',padding:'10px',border:'none',borderRadius:'6px',fontWeight:'bold',marginTop:'8px'}}
                >
                    Đăng nhập
                </button>
            </form>
            <div style={{marginTop:'16px',textAlign:'center'}}>
                <Link to="/forgot" style={{color:'#1976d2',textDecoration:'underline',display:'block',marginBottom:'8px'}}>Quên mật khẩu?</Link>
                <span>Bạn chưa có tài khoản? <Link to="/register" style={{color:'#1976d2',textDecoration:'underline'}}>Đăng ký</Link></span>
            </div>
            {error && <p style={{color:'red',marginTop:'12px',textAlign:'center'}}>{error}</p>}
        </div>
    );
}

export default Login;
