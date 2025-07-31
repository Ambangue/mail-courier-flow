export interface PurchaseRequest {
  id: string;
  department: string;
  requestedBy: string;
  item: string;
  quantity: number;
  estimatedCost: number;
  justification: string;
  urgency: 'low' | 'medium' | 'high';
  preferredSupplier?: string;
  budgetCode: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

export interface IncidentReport {
  id: string;
  reportedBy: string;
  incidentDate: string;
  incidentTime: string;
  location: string;
  type: 'accident' | 'security' | 'equipment' | 'other';
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  witnessNames?: string;
  injuredPersons?: string;
  immediateActions: string;
  status: 'reported' | 'investigating' | 'resolved';
  investigatedBy?: string;
  resolution?: string;
  attachments?: string[];
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'paternity' | 'special';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  emergencyContact?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

export interface MaintenanceRequest {
  id: string;
  requestedBy: string;
  department: string;
  equipment: string;
  issueDescription: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestDate: string;
  preferredDate?: string;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed';
  assignedTo?: string;
  completionDate?: string;
  workPerformed?: string;
  cost?: number;
}

// Nouveaux formulaires business
export interface ExpenseAdvanceRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  requestType: 'advance' | 'reimbursement';
  amount: number;
  purpose: string;
  expectedDate: string;
  justification: string;
  receipts?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approvedBy?: string;
  paymentDate?: string;
}

export interface MissionOrder {
  id: string;
  employeeId: string;
  employeeName: string;
  destination: string;
  purpose: string;
  startDate: string;
  endDate: string;
  transportMode: 'car' | 'plane' | 'train' | 'bus';
  accommodationRequired: boolean;
  dailyAllowance: number;
  estimatedCost: number;
  authorizedBy: string;
  status: 'pending' | 'approved' | 'completed';
}

export interface TimeSheet {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakDuration: number;
  overtimeHours: number;
  absenceReason?: string;
  status: 'present' | 'absent' | 'late';
  approvedBy?: string;
}

export interface PerformanceEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  evaluatorName: string;
  evaluationPeriod: string;
  objectives: string;
  achievements: string;
  strengths: string;
  areasForImprovement: string;
  trainingNeeds: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
  comments: string;
  nextReviewDate: string;
}

export interface ITServiceRequest {
  id: string;
  requestedBy: string;
  department: string;
  serviceType: 'software' | 'hardware' | 'access' | 'support';
  description: string;
  businessJustification: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost?: number;
  securityImplications: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
}

export interface MeetingMinutes {
  id: string;
  meetingType: 'board' | 'management' | 'team' | 'committee';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  chairperson: string;
  attendees: string[];
  agenda: string;
  discussions: string;
  decisions: string[];
  actionItems: Array<{
    task: string;
    assignedTo: string;
    dueDate: string;
  }>;
  nextMeetingDate?: string;
}

export interface SupplierClientForm {
  id: string;
  type: 'supplier' | 'client';
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rccm?: string;
  niu?: string;
  taxClearanceCertificate?: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    iban?: string;
  };
  paymentTerms: string;
  creditLimit?: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  deliveryDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  paymentTerms: string;
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'invoiced';
  authorizedBy: string;
}

export interface DeliveryReceipt {
  id: string;
  purchaseOrderId: string;
  supplierName: string;
  deliveryDate: string;
  receivedBy: string;
  items: Array<{
    description: string;
    quantityOrdered: number;
    quantityReceived: number;
    condition: 'good' | 'damaged' | 'partial';
    remarks?: string;
  }>;
  overallCondition: 'satisfactory' | 'unsatisfactory';
  discrepancies?: string;
  signature: string;
}