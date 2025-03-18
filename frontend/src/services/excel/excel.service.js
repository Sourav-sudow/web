import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

// File path for the registration data Excel file
const REGISTRATION_FILE_PATH = '/exports/registration_data.xlsx';

/**
 * Save registration data to Excel file
 * @param {Object} userData - User registration data
 * @returns {Promise<boolean>} - Success status
 */
export const saveRegistrationToExcel = async (userData) => {
  try {
    // Format the data for Excel
    const registrationData = {
      id: userData.id || Date.now(),
      firstName: userData.firstName || userData.first_name || '',
      lastName: userData.lastName || userData.last_name || '',
      email: userData.email || '',
      username: userData.username || userData.email?.split('@')[0] || '',
      password: userData.password || 'N/A',
      role: userData.role || 'student',
      department: userData.department || 'N/A',
      phone: userData.phone || 'N/A',
      semester: userData.semester || 'N/A',
      registeredAt: userData.registeredAt || new Date().toISOString(),
      isNewUser: true,
      // For students, initialize attendance data to 0
      totalClasses: 0,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      attendancePercentage: 0
    };

    console.log('Saving registration data:', registrationData);

    // Get existing data from localStorage
    let existingData = [];
    try {
      const storedData = localStorage.getItem('registrationExcelData');
      if (storedData) {
        existingData = JSON.parse(storedData);
        
        // Check if user already exists (by email or id)
        const existingIndex = existingData.findIndex(
          item => (item.email === registrationData.email) || (item.id === registrationData.id)
        );
        
        if (existingIndex >= 0) {
          // Update existing user
          existingData[existingIndex] = {
            ...existingData[existingIndex],
            ...registrationData,
            updatedAt: new Date().toISOString()
          };
          console.log('Updated existing user in registration data');
        } else {
          // Add new user
          existingData.push(registrationData);
          console.log('Added new user to registration data');
        }
      } else {
        // First user
        existingData.push(registrationData);
        console.log('Created new registration data with first user');
      }
    } catch (error) {
      console.log('No existing data found or error parsing, creating new dataset', error);
      existingData = [registrationData];
    }

    // Save to localStorage to simulate persistence
    localStorage.setItem('registrationExcelData', JSON.stringify(existingData));
    
    console.log('Registration data saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving registration data:', error);
    return false;
  }
};

/**
 * Get registration data Excel file for download
 * @returns {Blob} - Excel file as Blob
 */
export const getRegistrationExcelFile = () => {
  try {
    // Get data from localStorage
    const storedData = localStorage.getItem('registrationExcelData');
    
    if (!storedData) {
      console.error('No registration data found');
      return null;
    }
    
    const registrationData = JSON.parse(storedData);
    
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create a worksheet from the data
    const worksheet = XLSX.utils.json_to_sheet(registrationData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Create Blob
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return blob;
  } catch (error) {
    console.error('Error getting registration Excel file:', error);
    return null;
  }
};

/**
 * Download registration data as Excel file
 * @returns {boolean} - Success status
 */
export const downloadRegistrationExcel = () => {
  try {
    const blob = getRegistrationExcelFile();
    
    if (!blob) {
      console.error('Failed to generate Excel file');
      return false;
    }
    
    FileSaver.saveAs(blob, 'registration_data.xlsx');
    return true;
  } catch (error) {
    console.error('Error downloading registration Excel file:', error);
    return false;
  }
};

/**
 * Get registration data as JSON
 * @returns {Array} - Registration data as array of objects
 */
export const getRegistrationData = () => {
  try {
    const storedData = localStorage.getItem('registrationExcelData');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error getting registration data:', error);
    return [];
  }
}; 