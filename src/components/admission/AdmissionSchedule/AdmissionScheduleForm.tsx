import React from 'react';

export interface AdmissionScheduleFormProps {
  form: {
    admissionAt: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AdmissionScheduleForm: React.FC<AdmissionScheduleFormProps> = ({ form, onChange, onSubmit, onCancel }) => (
  <div className="admission-schedule-form-modal">
    <h2 className="admission-schedule-form-title">Create Admission Schedule</h2>
    <form onSubmit={onSubmit}>
      <div className="admission-schedule-form-group">
        <label className="admission-schedule-form-label">Admission At</label>
        <input type="datetime-local" name="admissionAt" value={form.admissionAt} onChange={onChange} required className="admission-schedule-form-input" />
      </div>
      <div className="admission-schedule-form-actions">
        <button type="button" className="admission-schedule-cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="admission-schedule-submit-btn">Submit</button>
      </div>
    </form>
  </div>
);

export default AdmissionScheduleForm;
