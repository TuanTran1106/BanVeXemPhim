import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';

function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await getMovieById(id);
                setMovie(res.data);
            } catch (err) {
                setMovie(null);
            }
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (!movie) return <p>Không tìm thấy phim!</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>{movie.title}</h2>
            <p>{movie.description}</p>
            <p>Giá: {movie.price} VNĐ</p>
            <button onClick={() => navigate(`/booking/${movie.id}`)}>Đặt vé</button>
        </div>
    );
}

export default MovieDetail;
