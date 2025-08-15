import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080';

function ShowtimeSelect() {
  const { movieId } = useParams();
  // Chuẩn hóa movieId đề phòng URL bị kèm ký tự (ví dụ: 1:1)
  const movieIdSafe = React.useMemo(() => {
    if (movieId == null) return '';
    // Lấy phần trước dấu ':' nếu có, và chỉ giữ chữ số
    const firstPart = String(movieId).split(':')[0];
    const onlyDigits = firstPart.match(/\d+/);
    return onlyDigits ? onlyDigits[0] : '';
  }, [movieId]);
  const navigate = useNavigate();
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [roomSeatCount, setRoomSeatCount] = useState({}); // roomId -> total seats
  const [soldCountByShowtime, setSoldCountByShowtime] = useState({}); // showtimeId -> sold count

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Gọi 1 endpoint ổn định để tránh 404, sau đó lọc theo movieId
        const all = await axios.get(`${API_BASE}/api/showtimes`);
        const idNum = Number(movieIdSafe);
        let items = (Array.isArray(all.data) ? all.data : []).filter(st => String(st?.movies?.id) === String(idNum));
        // sắp xếp và đặt mặc định ngày/giờ đầu tiên
        items.sort((a,b)=> new Date(a.startTime) - new Date(b.startTime));
        setShowtimes(items);
        if (items.length > 0) {
          const firstKey = (() => {
            const d = new Date(items[0].startTime);
            const y = d.getFullYear();
            const m = String(d.getMonth()+1).padStart(2,'0');
            const day = String(d.getDate()).padStart(2,'0');
            return `${y}-${m}-${day}`;
          })();
          setSelectedDate(firstKey);
          setSelectedTime('');
        }
      } catch {
        setShowtimes([]);
      }
      setLoading(false);
    };
    load();
  }, [movieIdSafe]);

  // load toàn bộ ghế để đếm số ghế theo phòng (room)
  useEffect(() => {
    const loadSeats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/seats`);
        const seats = Array.isArray(res.data) ? res.data : [];
        const counts = seats.reduce((map, s) => {
          const roomId = s?.screeningRooms?.id;
          if (!roomId) return map;
          map[roomId] = (map[roomId] || 0) + 1;
          return map;
        }, {});
        setRoomSeatCount(counts);
      } catch {
        setRoomSeatCount({});
      }
    };
    loadSeats();
  }, []);

  const getDateKey = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // key ổn định theo DB
  };

  const groups = React.useMemo(() => {
    const map = new Map();
    for (const st of showtimes || []) {
      const d = new Date(st.startTime);
      const key = getDateKey(d);
      const display = d.toLocaleDateString('vi-VN');
      if (!map.has(key)) map.set(key, { display, items: [] });
      map.get(key).items.push(st);
    }
    // sắp xếp giờ trong mỗi ngày
    for (const [, group] of map) {
      group.items.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    }
    return map;
  }, [showtimes]);

  // nếu người dùng đổi ngày và ngày đó chỉ có 1 giờ thì tự chọn luôn
  useEffect(() => {
    const group = groups.get(selectedDate);
    if (group && group.items.length === 1) {
      setSelectedTime(String(group.items[0].id));
    }
  }, [selectedDate, groups]);

  // Khi đổi ngày, tải số vé đã bán cho các suất của ngày đó để hiển thị số ghế trống
  useEffect(() => {
    const group = groups.get(selectedDate);
    if (!group) return;
    const ids = group.items.map(s => s.id);
    const token = localStorage.getItem('token');
    const cfg = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const fetchSoldCount = async (id) => {
      try {
        const r = await axios.get(`${API_BASE}/api/tickets/showtime/${id}`, cfg);
        return Array.isArray(r.data) ? r.data.length : 0;
      } catch (e) {
        // Fallback: lấy toàn bộ tickets rồi lọc theo showtime
        const all = await axios.get(`${API_BASE}/api/tickets`, cfg);
        const list = Array.isArray(all.data) ? all.data : [];
        return list.filter(t => String(t?.showtimes?.id) === String(id)).length;
      }
    };
    Promise.all(ids.map(id => fetchSoldCount(id)))
      .then(counts => {
        const map = {};
        counts.forEach((cnt, idx) => {
          const id = ids[idx];
          map[id] = cnt;
        });
        setSoldCountByShowtime(prev => ({ ...prev, ...map }));
      })
      .catch(() => {});
  }, [selectedDate, groups]);

  const dateTabs = useMemo(() => Array.from(groups.entries()), [groups]);

  const getAvailable = (st) => {
    const roomId = st?.screeningRooms?.id;
    let total = roomSeatCount[roomId];
    // Fallback nếu chưa lấy được tổng ghế theo phòng: mặc định 96 ghế (8x12)
    if (!Number.isFinite(total) || total <= 0) total = 96;
    const sold = Number.isFinite(soldCountByShowtime[st.id]) ? soldCountByShowtime[st.id] : 0;
    const available = Math.max(total - sold, 0);
    return { total, sold, available };
  };

  const dayOfWeek = (d) => {
    return d.toLocaleDateString('vi-VN', { weekday: 'short' }); // T2..CN
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Chọn khung giờ chiếu</h2>
      {/* Thanh chọn ngày dạng tab ngang */}
      <div style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16, marginBottom:16 }}>
        <div style={{ display:'flex', overflowX:'auto', gap:16 }}>
          {dateTabs.map(([key, group]) => {
            const d = new Date(group.items[0].startTime);
            const dayNum = d.getDate();
            const sub = `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(-2)} - ${dayOfWeek(d)}`;
            const active = key === selectedDate;
            return (
              <button key={key}
                onClick={()=> { setSelectedDate(key); setSelectedTime(''); }}
                style={{
                  minWidth: 90,
                  padding:'10px 12px',
                  border: active ? '2px solid #1976d2' : '1px solid #ddd',
                  background: active ? '#eaf2ff' : '#fff',
                  borderRadius:12,
                  cursor:'pointer'
                }}>
                <div style={{ fontSize:24, fontWeight:700, color: active ? '#1976d2' : '#222', lineHeight:1 }}>{dayNum}</div>
                <div style={{ color:'#666', marginTop:4, fontSize:12 }}>{sub}</div>
              </button>
            );
          })}
        </div>
      </div>
      {loading ? (
        <div>Đang tải khung giờ...</div>
      ) : showtimes.length === 0 ? (
        <div>Chưa có suất chiếu cho phim này.</div>
      ) : (
        // Chỉ hiển thị các suất của ngày đang chọn
        (() => {
          const group = groups.get(selectedDate);
          if (!group) return null;
          return (
          <div key={selectedDate} style={{ background:'#fff', border:'1px solid #eee', borderRadius:12, padding:16, marginBottom:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>{group.display}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
              {group.items.map(st => {
                const timeStr = new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                const { available } = getAvailable(st);
                const isActive = String(st.id) === String(selectedTime);
                return (
                <button key={st.id}
                  onClick={() => setSelectedTime(String(st.id))}
                  style={{ padding:'10px 12px', border:isActive ? '2px solid #1976d2' : '1px solid #1976d2', color:isActive ? '#fff' : '#1976d2', background:isActive ? '#1976d2' : '#eaf2ff', borderRadius:8, cursor:'pointer' }}>
                  <div style={{ fontWeight:700 }}>{timeStr}</div>
                  <div style={{ fontSize:12, color:isActive ? '#e8f1ff' : '#555' }}>{available} ghế trống</div>
                </button>
                );
              })}
            </div>
            <div style={{ textAlign:'right', marginTop: 12 }}>
              <button
                disabled={!selectedTime}
                onClick={() => navigate(`/booking/${selectedTime}`)}
                style={{ padding:'10px 14px', background: selectedTime ? '#1976d2' : '#9e9e9e', color:'#fff', border:'none', borderRadius:8, cursor: selectedTime ? 'pointer' : 'not-allowed' }}
              >
                Tiếp tục chọn ghế
              </button>
            </div>
          </div>
          );
        })()
      )}
      <div style={{ textAlign:'center', marginTop: 12 }}>
        <button onClick={()=>navigate(-1)} style={{ padding:'8px 12px', background:'#eee', border:'1px solid #ddd', borderRadius:8, cursor:'pointer' }}>Quay lại</button>
      </div>
    </div>
  );
}

export default ShowtimeSelect;

