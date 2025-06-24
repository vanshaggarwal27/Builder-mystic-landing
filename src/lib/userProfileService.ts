// User Profile Service - Handles user profile and schedule data
export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;

  // Student specific fields
  grade?: string;
  studentId?: string;
  parentName?: string;
  parentPhone?: string;
  emergencyContact?: string;
  admissionDate?: string;

  // Teacher specific fields
  teacherId?: string;
  department?: string;
  position?: string;
  experience?: string;
  subjects?: string;
  joiningDate?: string;

  // Common fields
  role?: "student" | "teacher" | "admin";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher?: string;
  room?: string;
  type?: "class" | "break" | "lunch" | "assembly" | "lab";
  grade?: string;
  isImportant?: boolean;
}

class UserProfileServiceClass {
  private readonly API_BASE_URL = "https://shkva-backend-new.onrender.com/api";

  private getAuthToken(): string | null {
    return localStorage.getItem("authToken");
  }

  private getAuthHeaders() {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Get the current user's profile data
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        // If profile endpoint doesn't exist, return a minimal profile
        if (response.status === 404) {
          return this.createFallbackProfile();
        }
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      return this.normalizeProfileData(data);
    } catch (error) {
      console.warn("Profile fetch failed, using fallback:", error);
      return this.createFallbackProfile();
    }
  }

  /**
   * Get the user's schedule/timetable
   */
  async getUserSchedule(): Promise<ScheduleItem[]> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Try to fetch real schedule data
      const response = await fetch(
        `${this.API_BASE_URL}/schedule/my-schedule`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        // If schedule endpoint doesn't exist, return demo schedule
        if (response.status === 404) {
          return this.getDemoSchedule();
        }
        throw new Error(`Failed to fetch schedule: ${response.statusText}`);
      }

      const data = await response.json();
      return this.normalizeScheduleData(data);
    } catch (error) {
      console.warn("Schedule fetch failed, using demo schedule:", error);
      return this.getDemoSchedule();
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const data = await response.json();
      return this.normalizeProfileData(data);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  }

  /**
   * Create a fallback profile when backend data is not available
   */
  private createFallbackProfile(): UserProfile {
    const userData = this.getUserDataFromStorage();
    return {
      id: userData.id || "unknown",
      firstName: userData.name?.split(" ")[0] || "User",
      lastName: userData.name?.split(" ").slice(1).join(" ") || "",
      email: userData.email || "user@example.com",
      role: userData.role || "student",
      isActive: true,
      // Set defaults based on role
      ...(userData.role === "student" && {
        grade: "Not assigned",
        studentId: "Not assigned",
      }),
      ...(userData.role === "teacher" && {
        teacherId: "Not assigned",
        department: "Not assigned",
        position: "Teacher",
      }),
    };
  }

  /**
   * Get demo schedule when real data is not available
   */
  private getDemoSchedule(): ScheduleItem[] {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const schedule: ScheduleItem[] = [];

    daysOfWeek.forEach((day) => {
      // Morning assembly
      schedule.push({
        id: `${day.toLowerCase()}-assembly`,
        day,
        time: "8:00 AM - 8:15 AM",
        subject: "Morning Assembly",
        type: "assembly",
        isImportant: true,
      });

      // Classes
      const subjects = [
        "Mathematics",
        "English",
        "Science",
        "History",
        "Geography",
      ];
      subjects.forEach((subject, index) => {
        const startHour = 8 + index + 1;
        const endHour = startHour + 1;
        schedule.push({
          id: `${day.toLowerCase()}-${subject.toLowerCase()}`,
          day,
          time: `${startHour}:15 ${startHour < 12 ? "AM" : "PM"} - ${endHour}:00 ${endHour < 12 ? "AM" : "PM"}`,
          subject,
          teacher: `Teacher ${index + 1}`,
          room: `Room ${index + 1}01`,
          type: "class",
        });
      });

      // Lunch break
      schedule.push({
        id: `${day.toLowerCase()}-lunch`,
        day,
        time: "1:00 PM - 2:00 PM",
        subject: "Lunch Break",
        type: "lunch",
      });
    });

    return schedule;
  }

  /**
   * Normalize profile data from different API formats
   */
  private normalizeProfileData(data: any): UserProfile {
    return {
      id: data.id || data._id || "unknown",
      firstName: data.firstName || data.first_name || "",
      lastName: data.lastName || data.last_name || "",
      email: data.email || "",
      phone: data.phone || data.phoneNumber || "",
      address: data.address || "",
      dateOfBirth: data.dateOfBirth || data.date_of_birth || "",
      gender: data.gender || "",
      bloodGroup: data.bloodGroup || data.blood_group || "",
      grade: data.grade || data.class || "",
      studentId: data.studentId || data.student_id || data.rollNumber || "",
      teacherId: data.teacherId || data.teacher_id || data.employeeId || "",
      department: data.department || "",
      position: data.position || data.designation || "",
      experience: data.experience || "",
      subjects: data.subjects || data.teachingSubjects || "",
      parentName:
        data.parentName || data.parent_name || data.guardianName || "",
      parentPhone:
        data.parentPhone || data.parent_phone || data.guardianPhone || "",
      emergencyContact: data.emergencyContact || data.emergency_contact || "",
      admissionDate: data.admissionDate || data.admission_date || "",
      joiningDate: data.joiningDate || data.joining_date || "",
      role: data.role || "student",
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt || data.created_at || "",
      updatedAt: data.updatedAt || data.updated_at || "",
    };
  }

  /**
   * Normalize schedule data from API
   */
  private normalizeScheduleData(data: any[]): ScheduleItem[] {
    return data.map((item) => ({
      id: item.id || item._id || `schedule-${Date.now()}-${Math.random()}`,
      day: item.day || "",
      time: item.time || item.timeSlot || "",
      subject: item.subject || item.title || "",
      teacher: item.teacher || item.teacherName || "",
      room: item.room || item.classroom || "",
      type: item.type || "class",
      grade: item.grade || item.class || "",
      isImportant: item.isImportant || false,
    }));
  }

  /**
   * Get user data from localStorage (fallback)
   */
  private getUserDataFromStorage(): any {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : {};
    } catch {
      return {};
    }
  }
}

// Export singleton instance
export const UserProfileService = new UserProfileServiceClass();

// Export types for convenience
export type { UserProfile, ScheduleItem };
