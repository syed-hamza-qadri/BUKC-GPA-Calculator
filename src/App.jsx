import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GPACalculator = () => {
  const [numCourses, setNumCourses] = useState('');
  const [courses, setCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [step, setStep] = useState(1);

  const gradeScale = {
    'A': 4.00,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3.00,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2.00,
    'C-': 1.67,
    'D+': 1.33,
    'D': 1.00,
    'F': 0.00
  };

  const handleNumCoursesSubmit = () => {
    const num = parseInt(numCourses);
    if (num > 0) {
      setCourses(Array(num).fill().map(() => ({ name: '', creditHours: '', grade: '' })));
      setStep(2);
    }
  };

  const handleCourseUpdate = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index] = { ...newCourses[index], [field]: value };
    setCourses(newCourses);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.creditHours && course.grade) {
        const credits = parseFloat(course.creditHours);
        totalPoints += credits * gradeScale[course.grade];
        totalCredits += credits;
      }
    });

    return totalCredits === 0 ? 0 : (totalPoints / totalCredits).toFixed(2);
  };

  const handleCalculate = () => {
    const isValid = courses.every(course => course.creditHours && course.grade);
    if (isValid) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setNumCourses('');
    setCourses([]);
    setShowResults(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">GPA Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="numCourses">Number of Courses</Label>
                <Input
                  id="numCourses"
                  type="number"
                  min="1"
                  value={numCourses}
                  onChange={(e) => setNumCourses(e.target.value)}
                  placeholder="Enter number of courses"
                  className="w-full"
                />
              </div>
              <Button 
                onClick={handleNumCoursesSubmit}
                className="w-full"
                disabled={!numCourses || parseInt(numCourses) < 1}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && !showResults && (
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Course Name (Optional)</Label>
                    <Input
                      id={`name-${index}`}
                      type="text"
                      value={course.name}
                      onChange={(e) => handleCourseUpdate(index, 'name', e.target.value)}
                      placeholder="e.g., Mathematics 101"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`credits-${index}`}>Credit Hours</Label>
                      <Select
                        value={course.creditHours}
                        onValueChange={(value) => handleCourseUpdate(index, 'creditHours', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`grade-${index}`}>Grade</Label>
                      <Select
                        value={course.grade}
                        onValueChange={(value) => handleCourseUpdate(index, 'grade', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(gradeScale).map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                onClick={handleCalculate}
                className="w-full"
                disabled={!courses.every(course => course.creditHours && course.grade)}
              >
                Calculate GPA
              </Button>
            </div>
          )}

          {showResults && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Your GPA</h3>
                <div className="text-4xl font-bold text-blue-600">
                  {calculateGPA()}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Course Breakdown:</h4>
                {courses.map((course, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {course.name || `Course ${index + 1}`}
                      </span>
                      <span className="text-sm text-gray-600">
                        {course.creditHours} credits - Grade: {course.grade}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleReset}
                className="w-full"
                variant="outline"
              >
                Calculate Another GPA
              </Button>
            </div>
          )}
        </CardContent>
         <CardFooter className="flex flex-col space-y-2 text-sm text-gray-500 border-t pt-4">
          <div className="text-center">
            Developed by{' '}
            <span className="font-medium text-gray-700">Syed Hamza Qadri</span>
          </div>
          <div className="text-center text-xs">
            Based on BUKC Grade System
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GPACalculator;