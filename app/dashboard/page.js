'use client';

import { useState } from 'react';

export default function ManageStudentsPage() {
  // Dummy data
  const [students, setStudents] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Street',
      guardianPhone: '08012345678',
      personalPhones: ['08087654321'],
      emails: ['john@example.com', 'john.doe@gmail.com'],
      subjects: ['English', 'Maths', 'Physics', 'Chemistry']
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const found = students.find(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()));
    if (found) {
      setSelectedStudent({ ...found });
      setError('');
    } else {
      setError('Student not found.');
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedStudent({ ...selectedStudent, [field]: value });
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...selectedStudent.personalPhones];
    updatedPhones[index] = value;
    setSelectedStudent({ ...selectedStudent, personalPhones: updatedPhones });
  };

  const handleAddPhone = () => {
    if (selectedStudent.personalPhones.length >= 2) return;
    setSelectedStudent({ ...selectedStudent, personalPhones: [...selectedStudent.personalPhones, ''] });
  };

  const handleRemovePhone = (index) => {
    const updatedPhones = selectedStudent.personalPhones.filter((_, i) => i !== index);
    setSelectedStudent({ ...selectedStudent, personalPhones: updatedPhones });
  };

  const handleEmailChange = (index, value) => {
    if (index === 0) return; // Main email cannot be changed
    const updatedEmails = [...selectedStudent.emails];
    updatedEmails[index] = value;
    setSelectedStudent({ ...selectedStudent, emails: updatedEmails });
  };

  const handleAddEmail = () => {
    if (selectedStudent.emails.length >= 2) return;
    setSelectedStudent({ ...selectedStudent, emails: [...selectedStudent.emails, ''] });
  };

  const handleRemoveEmail = (index) => {
    if (index === 0) return; // Main email cannot be removed
    const updatedEmails = selectedStudent.emails.filter((_, i) => i !== index);
    setSelectedStudent({ ...selectedStudent, emails: updatedEmails });
  };

  const handleSave = () => {
    if (!selectedStudent.guardianPhone || !selectedStudent.emails[0]) {
      setError('Guardian phone and main email cannot be empty.');
      return;
    }

    const allPhones = [selectedStudent.guardianPhone, ...selectedStudent.personalPhones.filter(p => p)];
    const uniquePhones = new Set(allPhones);
    if (uniquePhones.size !== allPhones.length) {
      setError('Duplicate phone numbers are not allowed.');
      return;
    }

    const validEmails = selectedStudent.emails.filter(e => e);
    const uniqueEmails = new Set(validEmails);
    if (uniqueEmails.size !== validEmails.length) {
      setError('Duplicate emails are not allowed.');
      return;
    }

    const updatedList = students.map(student => student.id === selectedStudent.id ? selectedStudent : student);
    setStudents(updatedList);
    setSelectedStudent(null);
    setError('');
    alert('Student record updated successfully.');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter student name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mr-2 w-64"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Search
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={selectedStudent.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="border p-2 w-full"
              required
            />
            <input
              type="text"
              value={selectedStudent.lastName}
              readOnly
              className="border p-2 w-full bg-gray-100"
            />
          </div>

          <input
            type="text"
            value={selectedStudent.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="border p-2 w-full"
            required
          />

          <input
            type="text"
            value={selectedStudent.guardianPhone}
            onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
            className="border p-2 w-full"
            required
          />

          <h2 className="font-semibold mb-2">Personal Phones</h2>
          {selectedStudent.personalPhones.map((phone, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                className="border p-2 w-full"
              />
              <button onClick={() => handleRemovePhone(index)} className="bg-red-500 text-white px-2 rounded">
                Remove
              </button>
            </div>
          ))}
          {selectedStudent.personalPhones.length < 2 && (
            <button onClick={handleAddPhone} className="bg-green-600 text-white px-3 py-1 rounded mb-4">
              Add Phone
            </button>
          )}

          <h2 className="font-semibold mb-2">Emails</h2>
          {selectedStudent.emails.map((email, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className={`border p-2 w-full ${index === 0 ? 'bg-gray-100' : ''}`}
                readOnly={index === 0}
              />
              {index !== 0 && (
                <button onClick={() => handleRemoveEmail(index)} className="bg-red-500 text-white px-2 rounded">
                  Remove
                </button>
              )}
            </div>
          ))}
          {selectedStudent.emails.length < 2 && (
            <button onClick={handleAddEmail} className="bg-green-600 text-white px-3 py-1 rounded mb-4">
              Add Email
            </button>
          )}

          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

