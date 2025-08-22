import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase-cred";
import { Calculator, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseData {
  id: string;
  department: string;
  duration: string;
  sanctionedIntake: number;
  govtQuotaSeats: number;
  mgmtQuotaSeats: number;
  nbaAccredited: boolean;
}

interface CourseMatrixSectionProps {
  data: CourseData[];
  onChange: (data: CourseData[]) => void;
}

// const departments = [
//   "Aeronautical Engineering",
//   "Agricultural Engineering", 
//   "Automobile Engineering",
//   "Biomedical Engineering",
//   "Biotechnology",
//   "Chemical Engineering",
//   "Civil Engineering",
//   "Computer Science and Engineering",
//   "Electrical and Electronics Engineering",
//   "Electronics and Communication Engineering",
//   "Electronics and Instrumentation Engineering",
//   "Food Technology",
//   "Information Technology",
//   "Instrumentation and Control Engineering",
//   "Marine Engineering",
//   "Mechanical Engineering",
//   "Metallurgical Engineering",
//   "Mining Engineering",
//   "Petroleum Engineering",
//   "Production Engineering",
//   "Textile Technology"
// ];

const CourseMatrixSection = ({ data, onChange }: CourseMatrixSectionProps) => {

  const [departments, setDepartments] = useState([])
  const addCourse = () => {
    const newCourse: CourseData = {
      id: `course-${Date.now()}`,
      department: "",
      duration: "4",
      sanctionedIntake: 0,
      govtQuotaSeats: 0,
      mgmtQuotaSeats: 0,
      nbaAccredited: false,
    };
    onChange([...data, newCourse]);
  };

  const removeCourse = (id: string) => {
    onChange(data.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof CourseData, value: unknown) => {
    const updatedData = data.map(course => {
      if (course.id === id) {
        const updatedCourse = { ...course, [field]: value };
        
        // Auto-calculate quota seats when sanctioned intake changes
        if (field === 'sanctionedIntake') {
          const intake = parseInt(value as string) || 0;
          updatedCourse.govtQuotaSeats = Math.round(intake * 0.65);
          updatedCourse.mgmtQuotaSeats = Math.round(intake * 0.35);
        }
        
        return updatedCourse;
      }
      return course;
    });
    onChange(updatedData);
  };

  useEffect(() => {
      const fetchDepartments = async () => {
        const { data, error } = await supabase
          .from("departments")
          .select("name")
          .order("name", { ascending: true });
  
        if (error) {
          console.error('Error fetching districts:', error);
        } else {
          setDepartments(data);
        }
      };
  
      fetchDepartments();
    }, []);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-tnea-blue">
            <GraduationCap className="h-5 w-5" />
            Course & Seat Matrix
          </CardTitle>
          <CardDescription>
            Add all engineering departments and their seat allocation details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No courses added yet</p>
              <Button onClick={addCourse} variant="outline">
                <Plus className="h-4 w-4" />
                Add First Course
              </Button>
            </div>
          ) : (
            <>
              {data.map((course) => (
                <Card key={course.id} className="border-tnea-border">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {course.department || "New Department"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {course.nbaAccredited && (
                          <Badge variant="secondary" className="bg-tnea-green text-white">
                            NBA Accredited
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(course.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Department *</Label>
                        <Select
                          value={course.department}
                          onValueChange={(value) => updateCourse(course.id, 'department', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem key={dept.name} value={dept.name}>
                                {dept.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Course Duration *</Label>
                        <Select
                          value={course.duration}
                          onValueChange={(value) => updateCourse(course.id, 'duration', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 Years</SelectItem>
                            <SelectItem value="4">4 Years</SelectItem>
                            <SelectItem value="5">5 Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Sanctioned Intake *</Label>
                        <Input
                          type="number"
                          placeholder="Total seats"
                          value={course.sanctionedIntake || ''}
                          onChange={(e) => updateCourse(course.id, 'sanctionedIntake', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Govt Quota (65%)
                        </Label>
                        <Input
                          type="number"
                          value={course.govtQuotaSeats || ''}
                          onChange={(e) => updateCourse(course.id, 'govtQuotaSeats', e.target.value)}
                          className="bg-tnea-light-blue"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Management Quota (35%)
                        </Label>
                        <Input
                          type="number"
                          value={course.mgmtQuotaSeats || ''}
                          onChange={(e) => updateCourse(course.id, 'mgmtQuotaSeats', e.target.value)}
                          className="bg-tnea-light-blue"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`nba-${course.id}`}
                        checked={course.nbaAccredited}
                        onCheckedChange={(checked) => updateCourse(course.id, 'nbaAccredited', checked)}
                      />
                      <Label htmlFor={`nba-${course.id}`} className="text-sm font-medium">
                        NBA Accredited Department
                      </Label>
                    </div>

                    {course.sanctionedIntake > 0 && (
                      <div className="mt-4 p-3 bg-tnea-light-blue rounded-lg">
                        <div className="text-sm text-tnea-blue font-medium">
                          Seat Distribution Summary:
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Total: {course.sanctionedIntake} | 
                          Govt: {course.govtQuotaSeats} | 
                          Management: {course.mgmtQuotaSeats}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addCourse} variant="outline" className="w-full">
                <Plus className="h-4 w-4" />
                Add Another Department
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseMatrixSection;