import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/db';
import { EMPLOYEE_CODE_PREFIX } from '../constants';

export const getEmployeeDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        role: true,
        department: true,
        designation: true,
        employmentType: true,
        address: true,
        documents: true,
        reportingManager: true,
      },
    });

    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sortBy = (req.query.sortBy as string) || 'id';
    const sortOrder = (req.query.sortOrder as string) === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;

    const whereClause: any = search
      ? {
          OR: [
            { employeeCode: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { mobileNo: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: whereClause,
        include: {
          role: true,
          department: true,
          designation: true,
          employmentType: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where: whereClause }),
    ]);

    res.json({
      data: employees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching employees' });
  }
};

export const getEmployeeFormConfigs = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await prisma.role.findMany();
    const departments = await prisma.department.findMany();
    const designations = await prisma.designation.findMany();
    const employmentTypes = await prisma.employmentType.findMany();
    res.json({ roles, departments, designations, employmentTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching configs' });
  }
};

const generateEmployeeCode = async (): Promise<string> => {
  const lastEmployee = await prisma.employee.findFirst({
    orderBy: { id: 'desc' }
  });
  
  if (!lastEmployee || !lastEmployee.employeeCode) {
    return `${EMPLOYEE_CODE_PREFIX}0001`;
  }
  
  const lastCode = lastEmployee.employeeCode;
  const numPart = lastCode.replace(EMPLOYEE_CODE_PREFIX, '');
  const num = parseInt(numPart);
  
  if (isNaN(num)) {
    // Fallback if parsing fails
    const count = await prisma.employee.count();
    return `${EMPLOYEE_CODE_PREFIX}${(count + 1).toString().padStart(4, '0')}`;
  }
  
  return `${EMPLOYEE_CODE_PREFIX}${(num + 1).toString().padStart(4, '0')}`;
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    console.log('Creating employee with data:', { email: data.email, employeeCode: 'pending' });
    
    const nextCode = await generateEmployeeCode();
    
    const newEmployee = await prisma.employee.create({
      data: {
        employeeCode: nextCode,
        name: data.name,
        nickName: data.nickName,
        mobileNo: data.mobileNo,
        emergencyContactNo: data.emergencyContactNo,
        email: data.email,
        photo: data.photo || null,
        
        role: { connect: { id: parseInt(data.roleId) } },
        department: { connect: { id: parseInt(data.departmentId) } },
        designation: { connect: { id: parseInt(data.designationId) } },
        employmentType: { connect: { id: parseInt(data.employmentTypeId) } },
        
        address: {
          create: {
            currentStreet: data.currentStreet || '',
            currentPin: data.currentPin || '',
            currentCity: data.currentCity || '',
            currentDist: data.currentDist || '',
            currentState: data.currentState || '',
            currentCountry: data.currentCountry || '',
            
            permanentStreet: data.permanentStreet || '',
            permanentPin: data.permanentPin || '',
            permanentCity: data.permanentCity || '',
            permanentDist: data.permanentDist || '',
            permanentState: data.permanentState || '',
            permanentCountry: data.permanentCountry || '',
          }
        },
        
        dob: new Date(data.dob),
        doj: new Date(data.doj),

        ...(data.reportingManagerId && { reportingManager: { connect: { id: parseInt(data.reportingManagerId) } } }),
        isActive: data.isActive !== undefined ? data.isActive : true,
        status: data.status || 'ACTIVE',
        
        ...(data.documents && Array.isArray(data.documents) && data.documents.length > 0 && {
          documents: {
            create: data.documents.filter((doc: any) => doc.documentName && doc.documentPath).map((doc: any) => ({
              documentName: doc.documentName,
              documentPath: doc.documentPath,
              originalName: doc.originalName || '',
              mimeType: doc.mimeType || '',
              size: doc.size ? parseInt(doc.size) : 0
            }))
          }
        })
      }
    });
    
    res.status(201).json(newEmployee);
  } catch (error: any) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: error.message || 'Server error creating employee', error });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employeeId = parseInt(id as string);
    const data = req.body;

    if (data.roleId && data.roleId !== '') data.roleId = parseInt(data.roleId);
    if (data.departmentId && data.departmentId !== '') data.departmentId = parseInt(data.departmentId);
    if (data.designationId && data.designationId !== '') data.designationId = parseInt(data.designationId);
    if (data.employmentTypeId && data.employmentTypeId !== '') data.employmentTypeId = parseInt(data.employmentTypeId);
    if (data.reportingManagerId && data.reportingManagerId !== '') data.reportingManagerId = parseInt(data.reportingManagerId);

    // Remove empty-string fields to avoid Prisma errors
    if (data.roleId === '') delete data.roleId;
    if (data.departmentId === '') delete data.departmentId;
    if (data.designationId === '') delete data.designationId;
    if (data.employmentTypeId === '') delete data.employmentTypeId;
    if (data.reportingManagerId === '') delete data.reportingManagerId;
    
    if (data.dob) data.dob = new Date(data.dob);
    if (data.doj) data.doj = new Date(data.doj);

    // Extract address data
    const addressData = {
      currentStreet: data.currentStreet,
      currentPin: data.currentPin,
      currentCity: data.currentCity,
      currentDist: data.currentDist,
      currentState: data.currentState,
      currentCountry: data.currentCountry,
      
      permanentStreet: data.permanentStreet,
      permanentPin: data.permanentPin,
      permanentCity: data.permanentCity,
      permanentDist: data.permanentDist,
      permanentState: data.permanentState,
      permanentCountry: data.permanentCountry,
    };
    
    // Remove relations and system fields before passing to Prisma
    delete data.id;
    delete data.employeeCode; // cannot update employee code
    delete data.password; // employee no longer has a password
    delete data.role;
    delete data.department;
    delete data.designation;
    delete data.employmentType;
    delete data.address;
    delete data.reportingManager;
    delete data.createdAt;
    delete data.updatedAt;
    
    // Delete individual address fields from main data object
    Object.keys(addressData).forEach(key => delete data[key]);
    
    // Save documents aside
    const documents = data.documents;
    delete data.documents;
    
    const updateData: any = {
      ...data,
      address: {
        upsert: {
          create: {
            currentStreet: addressData.currentStreet || '',
            currentPin: addressData.currentPin || '',
            currentCity: addressData.currentCity || '',
            currentDist: addressData.currentDist || '',
            currentState: addressData.currentState || '',
            currentCountry: addressData.currentCountry || '',
            permanentStreet: addressData.permanentStreet || '',
            permanentPin: addressData.permanentPin || '',
            permanentCity: addressData.permanentCity || '',
            permanentDist: addressData.permanentDist || '',
            permanentState: addressData.permanentState || '',
            permanentCountry: addressData.permanentCountry || '',
          },
          update: addressData
        }
      }
    };

    if (data.roleId) {
      updateData.role = { connect: { id: data.roleId } };
      delete updateData.roleId;
    }
    if (data.departmentId) {
      updateData.department = { connect: { id: data.departmentId } };
      delete updateData.departmentId;
    }
    if (data.designationId) {
      updateData.designation = { connect: { id: data.designationId } };
      delete updateData.designationId;
    }
    if (data.employmentTypeId) {
      updateData.employmentType = { connect: { id: data.employmentTypeId } };
      delete updateData.employmentTypeId;
    }
    if (data.reportingManagerId) {
      updateData.reportingManager = { connect: { id: data.reportingManagerId } };
      delete updateData.reportingManagerId;
    } else if (data.reportingManagerId === null) {
      updateData.reportingManager = { disconnect: true };
      delete updateData.reportingManagerId;
    }

    if (documents && Array.isArray(documents)) {
      updateData.documents = {
        deleteMany: {},
        create: documents.filter((doc: any) => doc.documentName && doc.documentPath).map((doc: any) => ({
          documentName: doc.documentName,
          documentPath: doc.documentPath,
          originalName: doc.originalName || '',
          mimeType: doc.mimeType || '',
          size: doc.size ? parseInt(doc.size) : 0
        }))
      };
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData
    });
    
    res.json(updatedEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: error.message || 'Server error updating employee', error });
  }
};

export const toggleEmployeeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive, status } = req.body;
    
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(id as string) },
      data: { isActive, status }
    });
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error toggling status:', error);
    res.status(500).json({ message: 'Server error toggling status' });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.employee.delete({
      where: { id: parseInt(id as string) }
    });
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
};
