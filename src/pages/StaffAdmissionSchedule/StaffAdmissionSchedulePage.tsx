import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdmissionSchedule {
  id: string;
  staff: string;
  admissionAt: string;
  status: string;
  user: string;
  meetlink: string;
  createdAt: string;
  response?: string;
}

interface RawAdmissionSchedule {
  id: string;
  staff: { username: string } | null;
  admissionAt: string;
  status: string;
  user: { username: string } | null;
  meetLink: string;
  createdAt: string;
}

const StaffAdmissionSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<AdmissionSchedule[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);
  const hasProcessedOAuth = useRef(false); // Thêm ref để theo dõi

  const fetchSchedules = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/schedules', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: RawAdmissionSchedule[]) => {
        const mappedData = data.map(
          (item): AdmissionSchedule => ({
            id: item.id,
            staff: item.staff?.username ?? '-',
            admissionAt: item.admissionAt,
            status: item.status,
            user: item.user?.username ?? '-',
            meetlink: item.meetLink,
            createdAt: item.createdAt,
            response: '',
          }),
        );
        setSchedules(mappedData);
      })
      .catch((error) => {
        console.error('Không thể tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Xử lý callback sau khi Google redirect về với code
  useEffect(() => {
    const processOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const scheduleId = localStorage.getItem('googleAuthScheduleId');

      if (code && scheduleId && !hasProcessedOAuth.current) {
        setIsProcessingOAuth(true);
        hasProcessedOAuth.current = true; // Đánh dấu là đã xử lý để tránh chạy lại
        const token = localStorage.getItem('token');
        try {
          const encodedCode = encodeURIComponent(code);
          const res = await fetch(`http://localhost:8080/api/schedules/meeting-link/${scheduleId}?code=${encodedCode}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'Tạo link meet thất bại' }));
            throw new Error(errorData.message || 'Tạo link meet thất bại!');
          }

          alert('Tạo link Google Meet thành công!');
          fetchSchedules(); // Tải lại danh sách lịch hẹn
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Đã có lỗi không xác định.';
          alert(`Lỗi: ${message}`);
        } finally {
          localStorage.removeItem('googleAuthScheduleId');
          navigate(window.location.pathname, { replace: true });
          setIsProcessingOAuth(false);
        }
      }
    };

    processOAuthCallback();
  }, [navigate, fetchSchedules]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleSave = async (scheduleId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/schedules/google-auth-url', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Không lấy được URL xác thực Google');
      }

      const authUrl = await res.text();
      localStorage.setItem('googleAuthScheduleId', scheduleId);
      window.location.href = authUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi không xác định.';
      alert(`Lỗi: ${message}`);
    }
  };

  return (
    <div>
      {isProcessingOAuth && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center',
          zIndex: 2000, color: 'white', fontSize: '1.5rem'
        }}>
          Đang xử lý xác thực Google...
        </div>
      )}
      <button className="back-to-home-btn" onClick={() => navigate('/')}>
        ← Về trang chủ
      </button>
      <h1 className="admission-schedule-title">Quản lý lịch tư vấn tuyển sinh</h1>
      <div className="admission-schedule-table-container">
        <table className="admission-schedule-table">
          <thead>
            <tr>
              <th>Staff</th>
              <th>Created At</th>
              <th>Admission At</th>
              <th>Status</th>
              <th>User</th>
              <th>Meetlink</th>
              <th>Response</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8}>Đang tải...</td></tr>
            ) : error ? (
              <tr><td colSpan={8} style={{ color: 'red' }}>{error}</td></tr>
            ) : schedules.map(s => (
              <tr key={s.id}>
                <td>{s.staff}</td>
                <td>{new Date(s.createdAt).toLocaleString()}</td>
                <td>{new Date(s.admissionAt).toLocaleString()}</td>
                <td>{s.status}</td>
                <td>{s.user}</td>
                <td>
                  {s.meetlink && (
                    <a
                      href={s.meetlink.startsWith('http') ? s.meetlink : `https://${s.meetlink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1976d2', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {s.meetlink}
                    </a>
                  )}
                </td>
                <td>{s.response}</td>
                <td>
                  <button
                    className="admission-schedule-btn"
                    onClick={() => handleEdit(s.id)}
                    style={s.status === 'COMPLETED' ? { opacity: 0.3, pointerEvents: 'none' } : {}}
                  >
                    Phản hồi
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.18)', zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        />
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', right: '50%', top: '50%',
          transform: 'translate(50%, -50%)', zIndex: 1001,
          background: '#fffbe7', borderRadius: 14,
          boxShadow: '0 2px 16px #0002', padding: 32, minWidth: 320
        }}>
          <h2 style={{ color: '#ff9800', textAlign: 'center', marginBottom: 20 }}>Phản hồi lịch tư vấn</h2>
          <div style={{ marginBottom: 16, textAlign: 'center', color: '#333' }}>
            Bạn có chắc chắn muốn phản hồi và xác thực tài khoản Google để tạo lịch không?
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="admission-schedule-cancel-btn" onClick={() => setShowModal(false)}>Hủy</button>
            <button className="admission-schedule-submit-btn" onClick={() => handleSave(editingId!)}>Xác thực Google</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffAdmissionSchedulePage;
