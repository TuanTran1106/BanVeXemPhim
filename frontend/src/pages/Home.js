import React, { useEffect, useState } from 'react';
import { getMovies } from '../services/movieService';
import { useNavigate } from 'react-router-dom';

function Home({ searchResult, searchTerm }) {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(8);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchResult !== null) return;
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await getMovies(page, size);
                console.log("Dữ liệu phim trả về:", res.data);
                if (res.data && res.data.content) {
                setMovies(res.data.content);
                } else if (Array.isArray(res.data)) {
                    setMovies(res.data);
                } else {
                    setMovies([]);
                }
            } catch (err) {
                console.error(err);
                setMovies([]);
            }
            setLoading(false);
        };
        fetchMovies();
    }, [page, size, searchResult]);

    const renderMovies = (list) => {
        if (!list || !Array.isArray(list) || list.length === 0) {
            return <p>Không có phim nào.</p>;
        }

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {list.map(movie => (
                    <div key={movie.id} 
                        style={{ 
                         border: '1px solid #e0e0e0', 
                         borderRadius: '12px', 
                         padding: '15px', 
                         background: '#fff',
                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                         cursor: 'pointer',
                         transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      onClick={() => window.location.href = `/movie/${movie.id}`}
                      >
                        {/* Ảnh phim */}
                        <div style={{ 
                            width: '100%', 
                            height: '200px', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            marginBottom: '15px',
                            background: '#f5f5f5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {movie.imageUrl ? (
                                <img 
                                    src={movie.imageUrl.startsWith('http') ? movie.imageUrl : `http://localhost:8080${movie.imageUrl}`}
                                    alt={movie.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                    onError={e => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) {
                                            e.target.nextSibling.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                            <div style={{
                                display: movie.imageUrl ? 'none' : 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: 'bold'
                            }}>
                                {movie.title ? movie.title.charAt(0).toUpperCase() : 'N/A'}
                            </div>
                        </div>

                        {/* Thông tin phim */}
                        <div>
                            <h3 style={{ 
                                margin: '0 0 10px 0',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#333',
                                lineHeight: '1.3'
                            }}>
                                {movie.title}
                            </h3>
                            
                            <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                                <p style={{ margin: '5px 0' }}>
                                    <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Thời lượng:</span> {movie.duration} phút
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Thể loại:</span> {movie.genre}
                                </p>
                                <p style={{ margin: '5px 0' }}>
                                    <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Đạo diễn:</span> {movie.director}
                                </p>
                                {movie.releaseDate && (
                                    <p style={{ margin: '5px 0' }}>
                                        <span style={{ fontWeight: 'bold', color: '#1976d2' }}>Ngày phát hành:</span> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}
                                    </p>
                                )}
                            </div>

                            <div style={{ display:'flex', gap:8, marginTop:12 }}>
                                <button 
                                    onClick={(e)=>{ e.stopPropagation(); navigate(`/showtimes/${movie.id}`); }}
                                    style={{ flex:1, padding:'10px', background:'#1976d2', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' }}
                                >Đặt vé</button>
                            </div>
                        </div>
                </div>
            ))}
        </div>
    );
    };

    // Hàm lọc phim chỉ theo title
    const filterMovies = (movies, term) => {
        if (!term) return movies;
        const lowerTerm = term.toLowerCase();
        return movies.filter(movie =>
            movie.title && movie.title.toLowerCase().includes(lowerTerm)
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ 
                textAlign: 'center',
                marginBottom: '30px',
                color: '#333',
                fontSize: '28px',
                fontWeight: 'bold'
            }}>
                Danh sách phim
            </h2>
            {/* Sử dụng filterMovies để lọc phim chỉ theo title */}
            {searchTerm ? (
                <>
                    <p style={{ 
                        textAlign: 'center', 
                        marginBottom: '20px',
                        fontSize: '16px',
                        color: '#666'
                    }}>
                        Kết quả tìm kiếm cho: <b style={{ color: '#1976d2' }}>{searchTerm}</b>
                    </p>
                    {renderMovies(filterMovies(movies, searchTerm))}
                </>
            ) : loading ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    fontSize: '18px',
                    color: '#666'
                }}>
                    Đang tải danh sách phim...
                </div>
            ) : (
                renderMovies(movies)
            )}
            
            {searchResult === null && !loading && movies.length > 0 && (
                <div style={{ 
                    marginTop: '30px', 
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <button 
                        onClick={() => setPage(page - 1)} 
                        disabled={page === 0}
                        style={{
                            padding: '10px 20px',
                            background: page === 0 ? '#ccc' : '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: page === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Trang trước
                    </button>
                    <span style={{ 
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333'
                    }}>
                        Trang {page + 1}
                    </span>
                    <button 
                        onClick={() => setPage(page + 1)} 
                        disabled={movies.length < size}
                        style={{
                            padding: '10px 20px',
                            background: movies.length < size ? '#ccc' : '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: movies.length < size ? 'not-allowed' : 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default Home;

