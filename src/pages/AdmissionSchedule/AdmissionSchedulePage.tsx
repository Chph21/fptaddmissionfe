import React, { useState, useEffect } from 'react';
import './AdmissionSchedule.css';
import AdmissionScheduleForm from '../../components/admission/AdmissionSchedule/AdmissionScheduleForm';
import AdmissionScheduleTable from '../../components/admission/AdmissionSchedule/AdmissionScheduleTable';
import { useNavigate } from 'react-router-dom';

const AdmissionSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    admissionAt: '',
    staff: '',
    meetlink: '',
    status: '',
  });
  const [schedules, setSchedules] = useState<any[]>([]);
  useEffect(() => {
    fetch('https://fpt-admission-system.onrender.com/api/schedules')
      .then((res) => res.json())
      .then((data) => {
        // Map API fields to table fields
        const mapped = data.map((item: any) => ({
          id: item.id || item.createAt + item.admissionAt,
          staff: item.staffId || '-',
          admissionAt: item.admissionAt,
          status: item.status,
          user: item.userId,
          meetlink: item.meetLink,
          createdAt: item.createAt,
        }));
        setSchedules(mapped);
      })
      .catch(() => setSchedules([]));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedules([
      ...schedules,
      {
        id: schedules.length + 1,
        admissionAt: form.admissionAt,
        staff: form.staff,
        meetlink: form.meetlink,
        status: form.status,
        createdAt: new Date().toISOString(),
      },
    ]);
    setForm({ admissionAt: '', staff: '', meetlink: '', status: '' });
    setShowForm(false);
  };

  return (
    <div className="admission-schedule-container">
      <button
        className="back-to-home-btn"
        onClick={() => navigate('/')}
      >
        ← Về trang chủ
      </button>
      <h1 className="admission-schedule-title">Admission Schedule</h1>
      <div className="admission-schedule-header">
        <button className="admission-schedule-btn" onClick={() => setShowForm(true)}>
          Đăng ký tư vấn tuyển sinh
        </button>
      </div>
      {showForm && (
        <AdmissionScheduleForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
      <AdmissionScheduleTable schedules={schedules} />
    </div>
  );
};

export default AdmissionSchedulePage;
