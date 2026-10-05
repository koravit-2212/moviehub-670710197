import MovieGrid from '../components/MovieGrid';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';

// หน้า "รายการที่อยากดู" ของสมาชิกที่ login อยู่ (เส้นทาง /me/wishlist ครอบด้วย ProtectedRoute แล้ว)
function Wishlist() {
  const { member, token } = useAuth();

  // เปลี่ยนค่าคงที่เป็น state แล้วโหลดด้วย useEffect
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState(token ? 'loading' : 'success');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setMovies([]);
      setStatus('success');
      setError(null);
      return;
    }

    let mounted = true;
    setStatus('loading');
    setError(null);

    getWishlist(token)
      .then((data) => {
        if (!mounted) return;
        setMovies(data.items || []);
        setStatus('success');
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">รายการที่อยากดูของ {member?.displayName}</h1>
      <p className="mb-6 text-sm text-slate-500">กดปุ่มหัวใจในหน้าหนังเพื่อเพิ่มเรื่องเข้ามาที่นี่</p>
      <MovieGrid movies={movies} status={status} error={error} />
    </div>
  );
}

export default Wishlist;
