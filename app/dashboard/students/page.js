'use client';

import { useState } from 'react';

const allSubjects = ['English', 'Maths', 'Physics', 'Chemistry', 'Commerce', 'Economics', 'Literature'];

export default function StudentRegistrationPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    guardianPhone: '',
    personalPhones: ['', ''],
    emails: ['', ''],
    subjects: ['English', 'Maths'], // pre-selected
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...form.personalPhones];
    updatedPhones[index] = value;
    setForm({ ...form, personalPhones: updatedPhones });
  };

  const handleEmailChange = (index, value) => {
    const updatedEmails = [...form.emails];
    updatedEmails[index] = value;
    setForm({ ...form, emails: updatedEmails });
  };

  const handleSubjectChange = (subject) => {
    if (form.subjects.includes(subject)) {
      // Prevent removing compulsory subjects
      if (subject === 'English' || subject === 'Maths') return;
      setForm({ ...form, subjects: form.subjects.filter(s => s !== subject) });
    } else {
      if (form.subjects.length >= 4) return;
      setForm({ ...form, subjects: [...form.subjects, subject] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const allPhones = [form.guardianPhone, ...form.personalPhones.filter(p => p)];
    const uniquePhones = new Set(allPhones);
    if (uniquePhones.size !== allPhones.length) {
      setError('Duplicate phone numbers are not allowed.');
      return;
    }

    const validEmails = form.emails.filter(e => e);
    const uniqueEmails = new Set(validEmails);
    if (uniqueEmails.size !== validEmails.length) {
      setError('Duplicate emails are not allowed.');
      return;
    }

    if (form.subjects.length < 4) {
      setError('Please select 4 subjects.');
      return;
    }

    setStudents([...students, form]);
    setForm({
      firstName: '',
      lastName: '',
      address: '',
      guardianPhone: '',
      personalPhones: ['', ''],
      emails: ['', ''],
      subjects: ['English', 'Maths'],
    });
    setError('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Registration</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 bg-white p-6 border rounded-lg shadow-md">
        {error && <div className="text-red-600">{error}</div>}

        <div className="flex gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
          />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />

        <input
          type="text"
          name="guardianPhone"
          placeholder="Guardian Phone (Compulsory)"
          value={form.guardianPhone}
          onChange={handleInputChange}
          className="border p-2 w-full"
          required
        />

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Personal Phone 1"
            value={form.personalPhones[0]}
            onChange={(e) => handlePhoneChange(0, e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Personal Phone 2"
            value={form.personalPhones[1]}
            onChange={(e) => handlePhoneChange(1, e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Email 1"
            value={form.emails[0]}
            onChange={(e) => handleEmailChange(0, e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email 2"
            value={form.emails[1]}
            onChange={(e) => handleEmailChange(1, e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Select Subjects (English & Maths are compulsory)</h2>
          <div className="grid grid-cols-3 gap-2">
            {allSubjects.map(subject => (
              <label key={subject} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.subjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                  disabled={subject === 'English' || subject === 'Maths'}
                />
                {subject}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Register Student
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Registered Students</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Phones</th>
            <th className="border p-2">Emails</th>
            <th className="border p-2">Subjects</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td className="border p-2">{student.firstName} {student.lastName}</td>
              <td className="border p-2">{student.address}</td>
              <td className="border p-2">
                Guardian: {student.guardianPhone}<br />
                Personal: {student.personalPhones.filter(p => p).join(', ')}
              </td>
              <td className="border p-2">{student.emails.filter(e => e).join(', ')}</td>
              <td className="border p-2">{student.subjects.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
