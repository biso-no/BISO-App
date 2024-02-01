import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Subunit } from '../types';
import axios from 'axios';
import { apiClient } from './fetch';

export const getDepartments = async (url: string): Promise<Subunit[]> => {
  try {
  const response = await apiClient({
    path: url,
    method: 'GET'
  })
  const departmentsArray = response.data.map((department: any) => ({
    name: department.Name,
    id: department.Id,
    campus: department.Campus,
    organisation: department.Organisation
  }));
  return departmentsArray;
}
catch (error) {
  console.log(error);
  return [];
}
}