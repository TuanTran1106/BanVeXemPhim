import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ROWS = ['A','B','C','D','E','F','G','H'];
const COLS = 12; // 8 x 12 = 96 ghế
const API_BASE = 'http://localhost:8080';

function Seat({ id, status, onToggle }) {
    const isSold = status === 'sold';
    const isSelected = status === 'selected';
    const isPending = status === 'pending';
    const background = isSold ? '#e57373' : isSelected ? '#81c784' : isPending ? '#ffd54f' : '#fff';
    const color = isSold ? '#fff' : '#333';
    return (
        <button
            disabled={isSold}
            onClick={() => onToggle(id)}
            style={{
                width: 36,
                height: 30,
                margin: 4,
                borderRadius: 6,
                border: '1px solid #bbb',
                background,
                color,
                cursor: isSold ? 'not-allowed' : 'pointer'
            }}
            title={id}
        >
            {id}
        </button>
    );
}

function Booking() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [soldSeats, setSoldSeats] = useState(new Set());
    const [pendingSeats] = useState(new Set()); // có thể dùng realtime sau
    const [price, setPrice] = useState(0);
    const [showtime, setShowtime] = useState(null);
    const [customer, setCustomer] = useState({ fullName: '', email: '', phone: '' });
    const [message, setMessage] = useState({ type: '', text: '' });

    // load vé đã bán của suất chiếu để đánh dấu ghế bán
    useEffect(() => {
        const load = async () => {
            // 1) Lấy thông tin suất chiếu và giá vé (độc lập với vé)
            try {
                const stRes = await axios.get(`${API_BASE}/api/showtimes/${showtimeId}`);
                const raw = stRes.data?.ticketPrice;
                const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '0').toString().replace(/[^0-9.]/g, ''));
                let priceNumber = Number.isFinite(parsed) ? parsed : 0;
                if (!priceNumber || priceNumber <= 0) {
                    priceNumber = 90000; // giá mặc định nếu DB chưa có
                }
                setPrice(priceNumber);
                setShowtime(stRes.data || null);
            } catch (e) {
                // fallback giá mặc định nếu gọi thất bại
                setPrice(90000);
            }

            // 2) Lấy vé đã bán cho suất để đánh dấu ghế
            try {
                const ticketsRes = await axios.get(`${API_BASE}/api/tickets/showtime/${showtimeId}`);
                const sold = new Set((ticketsRes.data || []).map(t => t.seats?.seatNumber).filter(Boolean));
                setSoldSeats(sold);
            } catch (e) {
                try {
                    const all = await axios.get(`${API_BASE}/api/tickets`);
                    const list = Array.isArray(all.data) ? all.data : [];
                    const sold = new Set(list.filter(t => String(t?.showtimes?.id) === String(showtimeId)).map(t => t.seats?.seatNumber).filter(Boolean));
                    setSoldSeats(sold);
                } catch {
                    setSoldSeats(new Set());
                }
            }
        };
        load();
    }, [showtimeId]);

    const seatsMatrix = useMemo(() => {
        const rows = [];
        for (let r = 0; r < ROWS.length; r++) {
            const rowId = ROWS[r];
            const seats = [];
            for (let c = 1; c <= COLS; c++) {
                const id = `${rowId}${c}`;
                let status = 'available';
                if (soldSeats.has(id)) status = 'sold';
                else if (selected.includes(id)) status = 'selected';
                else if (pendingSeats.has(id)) status = 'pending';
                seats.push({ id, status });
            }
            rows.push({ rowId, seats });
        }
        return rows;
    }, [soldSeats, selected, pendingSeats]);

    const total = useMemo(() => selected.length * (Number.isFinite(price) ? price : 0), [selected, price]);

    const toggleSeat = (id) => {
        if (soldSeats.has(id)) return;
        setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    };

    const handleBook = async () => {
        setMessage({ type: '', text: '' });
        if (selected.length === 0) {
            setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất 1 ghế.' });
            return;
        }
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        if (!userId) {
            setMessage({ type: 'error', text: 'Bạn cần đăng nhập để đặt vé.' });
            return;
        }
        try {
            const res = await axios.post(`${API_BASE}/api/tickets/book`, {
                showtimeId: Number(showtimeId),
                userId: Number(userId),
                seatNumbers: selected
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.status === 200) {
                setMessage({ type: 'success', text: 'Đặt vé thành công!' });
                // cập nhật ghế đã bán
                setSoldSeats(new Set([...Array.from(soldSeats), ...selected]));
                setSelected([]);
            }
        } catch (e) {
            setMessage({ type: 'error', text: e.response?.data || 'Đặt vé thất bại' });
        }
    };

    // format thời gian suất chiếu
    const formatDateTime = (iso) => {
        if (!iso) return '';
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString('vi-VN');
    };

    return (
        <div style={{ padding: 24, background: '#fafafa' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header thông tin suất chiếu */}
                <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#222' }}>
                                {showtime?.movies?.title || 'Chọn vé xem phim'}
                            </div>
                            <div style={{ color: '#666', marginTop: 6 }}>
                                Suất chiếu: <b>{formatDateTime(showtime?.startTime)}</b>
                            </div>
                        </div>
                        <div style={{ color: '#444' }}>
                            Giá vé: <b style={{ color: '#1976d2' }}>{(Number.isFinite(price) ? price : 0).toLocaleString('vi-VN')} đ</b>
                        </div>
                        <button onClick={()=>navigate(-1)} style={{ marginLeft: 16, padding: '8px 12px', background:'#eee', border:'1px solid #ddd', borderRadius:8, cursor:'pointer' }}>Quay lại</button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
                    {/* Khối sơ đồ ghế */}
                    <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        {/* Chú thích */}
                        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ width: 18, height: 14, background: '#fff', border: '1px solid #bbb', borderRadius: 3 }} /> Chưa bán
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ width: 18, height: 14, background: '#e57373', border: '1px solid #bbb', borderRadius: 3 }} /> Đã bán
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ width: 18, height: 14, background: '#81c784', border: '1px solid #bbb', borderRadius: 3 }} /> Đang chọn
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <div style={{ width: 18, height: 14, background: '#ffd54f', border: '1px solid #bbb', borderRadius: 3 }} /> Đang chờ
                            </div>
                        </div>

                        {/* Màn hình */}
                        <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
                            <div style={{ display: 'inline-block', padding: '8px 28px', background: '#e9ecef', borderRadius: 8, fontWeight: 600 }}>Màn Hình</div>
                        </div>

                        {/* Lưới ghế */}
                        <div style={{ display: 'grid', gap: 6, justifyContent: 'center' }}>
                            {seatsMatrix.map(row => (
                                <div key={row.rowId} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ width: 28, textAlign: 'center', fontWeight: 'bold', color: '#555' }}>{row.rowId}</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 560 }}>
                                        {row.seats.map(s => (
                                            <Seat key={s.id} id={s.id} status={s.status} onToggle={toggleSeat} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Khối thông tin & thanh toán */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ marginTop: 0 }}>Thông tin khách hàng</h3>
                            <input
                                placeholder="Họ tên"
                                value={customer.fullName}
                                onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                                style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd' }}
                            />
                            <input
                                placeholder="Email"
                                value={customer.email}
                                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd' }}
                            />
                            <input
                                placeholder="Số điện thoại"
                                value={customer.phone}
                                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 6, border: '1px solid #ddd' }}
                            />
                        </div>

                        <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h3 style={{ marginTop: 0 }}>Thông tin vé</h3>
                            <div style={{ background: '#f7f9fc', border: '1px solid #eef2f7', borderRadius: 8, padding: 12 }}>
                                <div style={{ marginBottom: 8 }}>Ghế đã chọn: <b>{selected.join(', ') || 'Chưa chọn'}</b></div>
                                <div style={{ marginBottom: 8 }}>Số lượng: <b>{selected.length}</b></div>
                                <div style={{ marginBottom: 8 }}>Tổng tiền: <b style={{ color: '#1976d2' }}>{total.toLocaleString('vi-VN')} đ</b></div>
                                <button onClick={handleBook} style={{ width: '100%', padding: 12, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                                    Đặt vé
                                </button>
                            </div>
                            {message.text && (
                                <div style={{ marginTop: 10, color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;
