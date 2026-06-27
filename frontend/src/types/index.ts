export interface Role {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  name: string;
}

export interface EmploymentType {
  id: number;
  name: string;
}

export interface EmployeeAddress {
  id: number;
  currentStreet: string;
  currentPin: string;
  currentCity: string;
  currentDist: string;
  currentState: string;
  currentCountry: string;
  permanentStreet: string;
  permanentPin: string;
  permanentCity: string;
  permanentDist: string;
  permanentState: string;
  permanentCountry: string;
}

export interface EmployeeDocument {
  id: number;
  documentName: string;
  documentPath: string;
}

export interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  nickName?: string;
  email: string;
  mobileNo: string;
  emergencyContactNo?: string;
  dob?: string;
  doj?: string;
  
  roleId?: number;
  role?: Role;
  
  departmentId?: number;
  department?: Department;
  
  designationId?: number;
  designation?: Designation;
  
  employmentTypeId?: number;
  employmentType?: EmploymentType;
  
  address?: EmployeeAddress;
  documents?: EmployeeDocument[];
  
  reportingManagerId?: number;
  reportingManager?: Employee;
  
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employee?: Employee;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

export interface Attendance {
  id: number;
  employeeId: number;
  employee?: Employee;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

export interface Payslip {
  id: number;
  employeeId: number;
  employee?: Employee;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
