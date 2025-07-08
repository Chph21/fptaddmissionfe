import React, { useState } from 'react';
import './AdmissionTicket.css';

export interface AdmissionTicket {
  id: number;
  staff: string;
  createDate: string;
  topic: string;
  content: string;
  response: string;
  status: string;
  user: string;
}

export interface AdmissionTicketFormProps {
  onSubmit: (ticket: { topic: string; content: string }) => void;
  disabled?: boolean;
}

const AdmissionTicketForm: React.FC<AdmissionTicketFormProps> = ({ onSubmit, disabled }) => {
  const [form, setForm] = useState({
    topic: '',
    content: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (disabled) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    onSubmit(form);
    setForm({ topic: '', content: '' });
  };

  return (
    <form className="admission-ticket-form" onSubmit={handleSubmit}>
      <h3 className="admission-ticket-title">Gửi yêu cầu tư vấn tuyển sinh</h3>
      <div className="admission-ticket-group">
        <label>Chủ đề</label>
        <input name="topic" value={form.topic} onChange={handleChange} required disabled={disabled} />
      </div>
      <div className="admission-ticket-group">
        <label>Nội dung</label>
        <textarea name="content" value={form.content} onChange={handleChange} required rows={3} disabled={disabled} />
      </div>
      <button type="submit" className="admission-ticket-submit" disabled={disabled}>Gửi yêu cầu</button>
    </form>
  );
};

export default AdmissionTicketForm;
