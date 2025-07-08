import React, { useEffect, useState } from 'react';

export interface AdmissionSchedule {
  id: string;
  staff: string;
  admissionAt: string;
  status: string;
  user: string;
  meetlink: string;
  createdAt: string;
}

const AdmissionScheduleTable: React.FC = () => {
  const [schedules, setSchedules] = useState<AdmissionSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://fpt-admission-system.onrender.com/api/schedules', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((item: any) => ({
          id: item.id || item.createAt + item.admissionAt,
          staff: item.staff && item.staff.username ? item.staff.username : '-',
          admissionAt: item.admissionAt,
          status: item.status,
          user: item.user && item.user.username ? item.user.username : '-',
          meetlink: item.meetLink,
          createdAt: item.createAt,
        }));
        setSchedules(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải dữ liệu');
        setLoading(false);
      });
  }, []);

  return (
    <div className="admission-schedule-table-container">
      <table className="admission-schedule-table">
        <thead>
          <tr>
            <th>Thời gian tư vấn</th>
            <th>Ngày đăng ký</th>
            <th>Nhân viên</th>
            <th>Trạng thái</th>
            <th>Meet Link</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5}>Đang tải...</td></tr>
          ) : error ? (
            <tr><td colSpan={5} style={{ color: 'red' }}>{error}</td></tr>
          ) : schedules.length === 0 ? (
            <tr>
              <td colSpan={5} className="admission-schedule-empty">Chưa có lịch tư vấn nào.</td>
            </tr>
          ) : (
            schedules.map((s) => (
              <tr key={s.id || s.createdAt + s.admissionAt}>
                <td>{s.admissionAt ? new Date(s.admissionAt).toLocaleString() : '-'}</td>
                <td>{s.createdAt ? new Date(s.createdAt).toLocaleString() : '-'}</td>
                <td>{s.staff || '-'}</td>
                <td>{s.status || '-'}</td>
                <td>
                  {s.meetlink ? (
                    <a href={s.meetlink} target="_blank" rel="noopener noreferrer" style={{ color: '#ff6600', textDecoration: 'underline' }}>
                      {s.meetlink}
                    </a>
                  ) : (
                    <span style={{ color: '#aaa' }}>Chưa có</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdmissionScheduleTable;
