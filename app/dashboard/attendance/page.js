"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Save, X } from "lucide-react"

// Student object structure:
// {
//   id: string,
//   firstName: string,
//   lastName: string,
//   address: string,
//   guardianPhone: string,
//   personalPhones: string[],
//   emails: string[],
//   subjects: string[]
// }

const AVAILABLE_SUBJECTS = [
  { name: "English", required: true },
  { name: "Maths", required: true },
  { name: "Physics", required: false },
  { name: "Chemistry", required: false },
  { name: "Commerce", required: false },
  { name: "Economics", required: false },
  { name: "Literature", required: false },
]

export default function StudentRegistration() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingStudent, setEditingStudent] = useState(null)
  const [errors, setErrors] = useState([])
  const [activeTab, setActiveTab] = useState("add")

  // Form state for adding new student
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    guardianPhone: "",
    personalPhones: [""],
    emails: [""],
    subjects: ["English", "Maths"], // Required subjects pre-selected
  })

  // Validation functions
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{11}$/
    return phoneRegex.test(phone.replace(/\D/g, ""))
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const checkDuplicatePhone = (phone, studentId) => {
    return students.some((student) => {
      if (studentId && student.id === studentId) return false
      return student.guardianPhone === phone || student.personalPhones.includes(phone)
    })
  }

  const checkDuplicateEmail = (email, studentId) => {
    return students.some((student) => {
      if (studentId && student.id === studentId) return false
      return student.emails.includes(email)
    })
  }

  const validateForm = (data, isEdit = false, originalStudent) => {
    const newErrors = []

    // Name validation
    if (!data.firstName.trim()) newErrors.push("First name is required")
    if (!data.lastName.trim()) newErrors.push("Last name is required")

    // Address validation
    if (!data.address.trim()) newErrors.push("Address is required")

    // Guardian phone validation
    if (!data.guardianPhone.trim()) {
      newErrors.push("Guardian phone number is required")
    } else if (!validatePhoneNumber(data.guardianPhone)) {
      newErrors.push("Guardian phone number must be 11 digits")
    } else if (checkDuplicatePhone(data.guardianPhone, originalStudent?.id)) {
      newErrors.push("Guardian phone number already exists")
    }

    // Personal phones validation
    const validPersonalPhones = data.personalPhones.filter((phone) => phone.trim())
    if (validPersonalPhones.length > 2) {
      newErrors.push("Maximum 2 personal phone numbers allowed")
    }

    validPersonalPhones.forEach((phone, index) => {
      if (!validatePhoneNumber(phone)) {
        newErrors.push(`Personal phone ${index + 1} must be 11 digits`)
      } else if (checkDuplicatePhone(phone, originalStudent?.id)) {
        newErrors.push(`Personal phone ${index + 1} already exists`)
      }
    })

    // Email validation
    const validEmails = data.emails.filter((email) => email.trim())
    if (validEmails.length === 0) {
      newErrors.push("At least one email is required")
    } else if (validEmails.length > 2) {
      newErrors.push("Maximum 2 emails allowed")
    }

    validEmails.forEach((email, index) => {
      if (!validateEmail(email)) {
        newErrors.push(`Email ${index + 1} is invalid`)
      } else if (checkDuplicateEmail(email, originalStudent?.id)) {
        newErrors.push(`Email ${index + 1} already exists`)
      }
    })

    // Subjects validation
    if (data.subjects.length !== 4) {
      newErrors.push("Exactly 4 subjects must be selected")
    }
    if (!data.subjects.includes("English")) {
      newErrors.push("English is compulsory")
    }
    if (!data.subjects.includes("Maths")) {
      newErrors.push("Maths is compulsory")
    }

    return newErrors
  }

  const handleAddStudent = () => {
    const validationErrors = validateForm(formData)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    const newStudent = {
      id: Date.now().toString(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      address: formData.address.trim(),
      guardianPhone: formData.guardianPhone.trim(),
      personalPhones: formData.personalPhones.filter((phone) => phone.trim()),
      emails: formData.emails.filter((email) => email.trim()),
      subjects: formData.subjects,
    }

    setStudents([...students, newStudent])
    setFormData({
      firstName: "",
      lastName: "",
      address: "",
      guardianPhone: "",
      personalPhones: [""],
      emails: [""],
      subjects: ["English", "Maths"],
    })
    setErrors([])
    alert("Student added successfully!")
  }

  const handleEditStudent = (student) => {
    setEditingStudent({
      ...student,
      personalPhones: [...student.personalPhones, ""].slice(0, 2),
      emails: [...student.emails, ""].slice(0, 2),
    })
    setActiveTab("search")
  }

  const handleUpdateStudent = () => {
    if (!editingStudent) return

    const originalStudent = students.find((s) => s.id === editingStudent.id)
    const validationErrors = validateForm(editingStudent, true, originalStudent)

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    const updatedStudent = {
      ...editingStudent,
      firstName: editingStudent.firstName.trim(),
      lastName: editingStudent.lastName.trim(),
      address: editingStudent.address.trim(),
      guardianPhone: editingStudent.guardianPhone.trim(),
      personalPhones: editingStudent.personalPhones.filter((phone) => phone.trim()),
      emails: editingStudent.emails.filter((email) => email.trim()),
    }

    setStudents(students.map((student) => (student.id === editingStudent.id ? updatedStudent : student)))
    setEditingStudent(null)
    setErrors([])
    alert("Student updated successfully!")
  }

  const handleSubjectChange = (subject, checked, isEdit = false) => {
    const currentSubjects = isEdit ? editingStudent?.subjects || [] : formData.subjects
    let newSubjects

    if (checked) {
      newSubjects = [...currentSubjects, subject]
    } else {
      if (subject === "English" || subject === "Maths") {
        alert(`${subject} is compulsory and cannot be removed`)
        return
      }
      newSubjects = currentSubjects.filter((s) => s !== subject)
    }

    if (newSubjects.length > 4) {
      alert("Maximum 4 subjects allowed")
      return
    }

    if (isEdit && editingStudent) {
      setEditingStudent({ ...editingStudent, subjects: newSubjects })
    } else {
      setFormData({ ...formData, subjects: newSubjects })
    }
  }

  const addPhoneField = (isEdit = false) => {
    if (isEdit && editingStudent) {
      if (editingStudent.personalPhones.length < 2) {
        setEditingStudent({
          ...editingStudent,
          personalPhones: [...editingStudent.personalPhones, ""],
        })
      }
    } else {
      if (formData.personalPhones.length < 2) {
        setFormData({
          ...formData,
          personalPhones: [...formData.personalPhones, ""],
        })
      }
    }
  }

  const removePhoneField = (index, isEdit = false) => {
    if (isEdit && editingStudent) {
      const newPhones = editingStudent.personalPhones.filter((_, i) => i !== index)
      setEditingStudent({ ...editingStudent, personalPhones: newPhones })
    } else {
      const newPhones = formData.personalPhones.filter((_, i) => i !== index)
      setFormData({ ...formData, personalPhones: newPhones })
    }
  }

  const addEmailField = (isEdit = false) => {
    if (isEdit && editingStudent) {
      if (editingStudent.emails.length < 2) {
        setEditingStudent({
          ...editingStudent,
          emails: [...editingStudent.emails, ""],
        })
      }
    } else {
      if (formData.emails.length < 2) {
        setFormData({
          ...formData,
          emails: [...formData.emails, ""],
        })
      }
    }
  }

  const removeEmailField = (index, isEdit = false) => {
    if (index === 0) {
      alert("Main email cannot be removed")
      return
    }

    if (isEdit && editingStudent) {
      const newEmails = editingStudent.emails.filter((_, i) => i !== index)
      setEditingStudent({ ...editingStudent, emails: newEmails })
    } else {
      const newEmails = formData.emails.filter((_, i) => i !== index)
      setFormData({ ...formData, emails: newEmails })
    }
  }

  const filteredStudents = students.filter(
    (student) =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.guardianPhone.includes(searchTerm) ||
      student.emails.some((email) => email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Register Students Here</h1>

      {errors.length > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertDescription>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Student</TabsTrigger>
          <TabsTrigger value="search">Search & Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Student</CardTitle>
              <CardDescription>Fill in all required information to register a new student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <Label htmlFor="guardianPhone">Guardian Phone Number *</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="Enter 10-digit phone number"
                />
              </div>

              <div>
                <Label>Personal Phone Numbers (Max 2, Optional)</Label>
                {formData.personalPhones.map((phone, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...formData.personalPhones]
                        newPhones[index] = e.target.value
                        setFormData({ ...formData, personalPhones: newPhones })
                      }}
                      placeholder={`Personal phone ${index + 1}`}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={() => removePhoneField(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.personalPhones.length < 2 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => addPhoneField()} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phone
                  </Button>
                )}
              </div>

              <div>
                <Label>Email Addresses (Max 2) *</Label>
                {formData.emails.map((email, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...formData.emails]
                        newEmails[index] = e.target.value
                        setFormData({ ...formData, emails: newEmails })
                      }}
                      placeholder={index === 0 ? "Main email (required)" : `Email ${index + 1}`}
                      disabled={index === 0 && formData.emails[0] && editingStudent}
                    />
                    {index > 0 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeEmailField(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {formData.emails.length < 2 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => addEmailField()} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                )}
              </div>

              <div>
                <Label>Subjects (Select exactly 4, English & Maths compulsory) *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {AVAILABLE_SUBJECTS.map((subject) => (
                    <div key={subject.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.name}
                        checked={formData.subjects.includes(subject.name)}
                        onCheckedChange={(checked) => handleSubjectChange(subject.name, checked)}
                        disabled={subject.required}
                      />
                      <Label htmlFor={subject.name} className="flex items-center gap-2">
                        {subject.name}
                        {subject.required && <Badge variant="secondary">Required</Badge>}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">Selected: {formData.subjects.length}/4</p>
              </div>

              <Button onClick={handleAddStudent} className="w-full cursor-pointer">
                Add Student
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Search Students</CardTitle>
                <CardDescription>Search by name, phone number, or email</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Search className="h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {editingStudent && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Editing: {editingStudent.firstName} {editingStudent.lastName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>First Name *</Label>
                      <Input
                        value={editingStudent.firstName}
                        onChange={(e) => setEditingStudent({ ...editingStudent, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Last Name *</Label>
                      <Input
                        value={editingStudent.lastName}
                        onChange={(e) => setEditingStudent({ ...editingStudent, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Address *</Label>
                    <Textarea
                      value={editingStudent.address}
                      onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Guardian Phone *</Label>
                    <Input
                      value={editingStudent.guardianPhone}
                      onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Personal Phones</Label>
                    {editingStudent.personalPhones.map((phone, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={phone}
                          onChange={(e) => {
                            const newPhones = [...editingStudent.personalPhones]
                            newPhones[index] = e.target.value
                            setEditingStudent({ ...editingStudent, personalPhones: newPhones })
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removePhoneField(index, true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {editingStudent.personalPhones.length < 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addPhoneField(true)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Phone
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label>Emails</Label>
                    {editingStudent.emails.map((email, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={email}
                          onChange={(e) => {
                            if (index === 0) {
                              alert("Main email cannot be changed")
                              return
                            }
                            const newEmails = [...editingStudent.emails]
                            newEmails[index] = e.target.value
                            setEditingStudent({ ...editingStudent, emails: newEmails })
                          }}
                          disabled={index === 0}
                          placeholder={index === 0 ? "Main email (cannot be changed)" : `Email ${index + 1}`}
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeEmailField(index, true)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {editingStudent.emails.length < 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addEmailField(true)}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Email
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label>Subjects</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {AVAILABLE_SUBJECTS.map((subject) => (
                        <div key={subject.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${subject.name}`}
                            checked={editingStudent.subjects.includes(subject.name)}
                            onCheckedChange={(checked) => handleSubjectChange(subject.name, checked, true)}
                            disabled={subject.required}
                          />
                          <Label htmlFor={`edit-${subject.name}`} className="flex items-center gap-2">
                            {subject.name}
                            {subject.required && <Badge variant="secondary">Required</Badge>}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleUpdateStudent}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setEditingStudent(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredStudents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      {students.length === 0
                        ? "No students registered yet."
                        : "No students found matching your search."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredStudents.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p>
                            <strong>Address:</strong> {student.address}
                          </p>
                          <p>
                            <strong>Guardian Phone:</strong> {student.guardianPhone}
                          </p>
                          {student.personalPhones.length > 0 && (
                            <p>
                              <strong>Personal Phones:</strong> {student.personalPhones.join(", ")}
                            </p>
                          )}
                          <p>
                            <strong>Emails:</strong> {student.emails.join(", ")}
                          </p>
                          <div>
                            <strong>Subjects:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {student.subjects.map((subject) => (
                                <Badge key={subject} variant="outline">
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEditStudent(student)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
