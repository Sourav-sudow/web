import api from './api';

/**
 * Mark attendance for a subject
 * @param {Object} attendanceData - Attendance data
 * @returns {Promise} - Promise with attendance response
 */
export const markAttendance = async (attendanceData) => {
  try {
    const response = await api.post('/attendance/mark', attendanceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to mark attendance' };
  }
};

/**
 * Get attendance report
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} - Promise with attendance report
 */
export const getAttendanceReport = async (params = {}) => {
  try {
    const response = await api.get('/attendance/report', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get attendance report' };
  }
};

/**
 * Get attendance statistics
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} - Promise with attendance statistics
 */
export const getAttendanceStats = async (params = {}) => {
  try {
    const response = await api.get('/attendance/stats', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get attendance statistics' };
  }
};

/**
 * Download attendance report as PDF
 * @param {string} reportId - ID of the report to download
 * @returns {Promise} - Promise with PDF blob
 */
export const downloadAttendanceReport = async (reportId) => {
  try {
    const response = await api.get(`/attendance/download/${reportId}`, {
      responseType: 'blob',
    });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `attendance_report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to download attendance report' };
  }
};

/**
 * Get all subjects
 * @returns {Promise} - Promise with subjects list
 */
export const getSubjects = async () => {
  try {
    const response = await api.get('/subjects');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get subjects' };
  }
};

/**
 * Generate attendance link for a class
 * @param {Object} linkData - Data for generating the link (classCode, duration, etc.)
 * @returns {Promise} - Promise with the generated link
 */
export const generateAttendanceLink = async (linkData) => {
  try {
    // In a real app, this would call the backend API
    // For now, we'll simulate it with a mock response
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a unique token (in a real app, this would come from the backend)
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Create the attendance link
    const baseUrl = window.location.origin;
    const attendanceLink = `${baseUrl}/attendance?class=${linkData.classCode}&token=${token}`;
    
    // Create the link object
    const newLink = {
      id: Date.now(), // Use timestamp as ID
      link: attendanceLink,
      classCode: linkData.classCode,
      className: linkData.className,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (linkData.duration || 3600000)).toISOString(), // Default 1 hour
      usageCount: 0,
      maxUsage: linkData.maxUsage || 30, // Default max usage
    };
    
    // Save to localStorage
    try {
      // Get existing links
      const existingLinksJSON = localStorage.getItem('teacherAttendanceLinks');
      let existingLinks = [];
      
      if (existingLinksJSON) {
        existingLinks = JSON.parse(existingLinksJSON);
      }
      
      // Add new link
      existingLinks.push(newLink);
      
      // Save back to localStorage
      localStorage.setItem('teacherAttendanceLinks', JSON.stringify(existingLinks));
      
      console.log('Saved attendance link to localStorage:', newLink);
    } catch (error) {
      console.error('Error saving attendance link to localStorage:', error);
    }
    
    return newLink;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to generate attendance link' };
  }
};

/**
 * Get recent attendance records with student details
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} - Promise with recent attendance records
 */
export const getRecentAttendanceRecords = async (params = {}) => {
  try {
    // In a real app, this would call the backend API
    // For now, we'll simulate it with a mock response
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock attendance records
    const mockRecords = [
      { 
        id: 1, 
        student: {
          id: 100001,
          name: 'John Smith', 
          photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        class: 'Mathematics 101',
        classCode: 'MATH101',
        date: '2023-03-16',
        time: '09:15 AM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 2, 
        student: {
          id: 100002,
          name: 'Emily Johnson', 
          photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        class: 'Mathematics 101',
        classCode: 'MATH101',
        date: '2023-03-16',
        time: '09:18 AM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 3, 
        student: {
          id: 100003,
          name: 'Michael Brown', 
          photo: 'https://randomuser.me/api/portraits/men/22.jpg',
        },
        class: 'Advanced Calculus',
        classCode: 'MATH201',
        date: '2023-03-15',
        time: '11:05 AM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 4, 
        student: {
          id: 100004,
          name: 'Jessica Davis', 
          photo: 'https://randomuser.me/api/portraits/women/17.jpg',
        },
        class: 'Linear Algebra',
        classCode: 'MATH301',
        date: '2023-03-15',
        time: '02:10 PM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 5, 
        student: {
          id: 100005,
          name: 'David Wilson', 
          photo: 'https://randomuser.me/api/portraits/men/91.jpg',
        },
        class: 'Statistics',
        classCode: 'MATH401',
        date: '2023-03-14',
        time: '01:08 PM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 6, 
        student: {
          id: 100006,
          name: 'Sarah Martinez', 
          photo: 'https://randomuser.me/api/portraits/women/28.jpg',
        },
        class: 'Mathematics 101',
        classCode: 'MATH101',
        date: '2023-03-14',
        time: '09:22 AM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 7, 
        student: {
          id: 100007,
          name: 'James Taylor', 
          photo: 'https://randomuser.me/api/portraits/men/45.jpg',
        },
        class: 'Advanced Calculus',
        classCode: 'MATH201',
        date: '2023-03-13',
        time: '11:12 AM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
      { 
        id: 8, 
        student: {
          id: 100008,
          name: 'Olivia Anderson', 
          photo: 'https://randomuser.me/api/portraits/women/63.jpg',
        },
        class: 'Linear Algebra',
        classCode: 'MATH301',
        date: '2023-03-13',
        time: '02:05 PM',
        status: 'Present',
        verificationMethod: 'Face Recognition'
      },
    ];
    
    // Filter records based on params if needed
    let filteredRecords = [...mockRecords];
    
    if (params.classCode) {
      filteredRecords = filteredRecords.filter(record => record.classCode === params.classCode);
    }
    
    if (params.date) {
      filteredRecords = filteredRecords.filter(record => record.date === params.date);
    }
    
    if (params.status) {
      filteredRecords = filteredRecords.filter(record => record.status === params.status);
    }
    
    // Sort by date and time (most recent first)
    filteredRecords.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB - dateA;
    });
    
    // Limit the number of records if specified
    if (params.limit && typeof params.limit === 'number') {
      filteredRecords = filteredRecords.slice(0, params.limit);
    }
    
    return {
      records: filteredRecords,
      total: mockRecords.length,
      filtered: filteredRecords.length
    };
  } catch (error) {
    throw error.response?.data || { error: 'Failed to get attendance records' };
  }
};
