import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import ShowtimeSelect from './pages/ShowtimeSelect';

function Header({ onSearch, user, role, onLogout }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    return (
        <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 30px',background:'#222',color:'#fff'}}>
            <div>
                <Link to="/" style={{color:'#fff',textDecoration:'none',fontWeight:'bold',fontSize:'22px'}}>Cinema Booking</Link>
            </div>
            <div>
                <input type="text" placeholder="Tìm phim..." value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'5px',borderRadius:'4px',border:'none'}} />
                <button onClick={()=>onSearch(search)} style={{marginLeft:'8px',padding:'5px 12px'}}>Tìm kiếm</button>
            </div>
            <div>
                {user ? (
                    <div style={{display:'flex',alignItems:'center',gap:'15px'}}>
                        <span>Xin chào, {user.fullName}</span>
                        {role === 'ADMIN' && <span style={{color:'#ffd700'}}>(Admin)</span>}
                        <button onClick={onLogout} style={{background:'#dc3545',color:'#fff',border:'none',padding:'5px 10px',borderRadius:'4px',cursor:'pointer'}}>
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" style={{color:'#fff',marginRight:'15px'}}>Đăng nhập</Link>
                        <Link to="/register" style={{color:'#fff'}}>Đăng ký</Link>
                    </div>
                )}
            </div>
        </header>
    );
}
function Footer() {
    return (
        <footer style={{textAlign:'center',padding:'16px',background:'#222',color:'#fff',marginTop:'40px'}}>
            &copy; {new Date().getFullYear()} Cinema Booking. All rights reserved.
        </footer>
    );
}

function Layout() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    // Nâng state user/role lên Layout
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [role, setRole] = useState(() => localStorage.getItem('role') || '');

    // Hàm cập nhật khi login thành công
    const handleLoginSuccess = (userObj, roleStr) => {
        setUser(userObj);
        setRole(roleStr);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setUser(null);
        setRole('');
    };

    const handleSearch = async (term) => {
        setSearchTerm(term);
        if (term) {
            const { searchMovies } = await import('./services/movieService');
            try {
                const res = await searchMovies(term, '');
                setSearchResult(res.data);
            } catch {
                setSearchResult([]);
            }
        } else {
            setSearchResult(null);
        }
    };

    return (
        <>
            <Header onSearch={handleSearch} user={user} role={role} onLogout={handleLogout} />
            <main style={{minHeight:'70vh'}}>
                <Routes>
                    <Route path='/' element={<Home searchResult={searchResult} searchTerm={searchTerm} />} />
                    <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/movie/:id' element={<MovieDetail />} />
                    <Route path='/showtimes/:movieId' element={<ShowtimeSelect />} />
                    <Route path='/booking/:showtimeId' element={<Booking />} />
                    <Route path='/payment/:ticketId' element={<Payment />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}

export default App;
