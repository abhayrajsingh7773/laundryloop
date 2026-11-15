import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  LaundryOrder,
  Complaint,
  SystemNotification,
  UserRole,
  StudentProfile,
  LaundryStatus,
  ComplaintStatus,
} from '../types';
import {
  CURRENT_STUDENT,
  INITIAL_ORDERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  STATUS_STEPS,
} from '../data/initialData';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface LaundryContextType {
  orders: LaundryOrder[];
  complaints: Complaint[];
  notifications: SystemNotification[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentStudent: StudentProfile;
  activeOrder: LaundryOrder | undefined;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  createOrder: (orderData: {
    studentName: string;
    studentId: string;
    hostel: string;
    roomNo: string;
    phone: string;
    totalItems: number;
    itemBreakdown: LaundryOrder['itemBreakdown'];
    specialCare?: string;
    notes?: string;
    estimatedDays?: number;
  }) => LaundryOrder;
  updateOrderStatus: (
    orderId: string,
    newStatus: LaundryStatus,
    note?: string,
    revisedDate?: string,
    delayReason?: string
  ) => void;
  verifyAndCollect: (orderId: string, enteredPin: string) => { success: boolean; message: string };
  createComplaint: (data: {
    orderId: string;
    category: Complaint['category'];
    description: string;
    preferredResolution: string;
  }) => Complaint;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    wardenNote?: string
  ) => void;
  resetDemoData: () => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  markNotificationAsRead: (id: string) => void;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  isGuideModalOpen: boolean;
  setIsGuideModalOpen: (open: boolean) => void;
}

const LaundryContext = createContext<LaundryContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ORDERS: 'laundryloop_orders_v1',
  COMPLAINTS: 'laundryloop_complaints_v1',
  NOTIFICATIONS: 'laundryloop_notifications_v1',
  ROLE: 'laundryloop_current_role_v1',
  STUDENT: 'laundryloop_student_profile_v1',
};

export const LaundryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<LaundryOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole;
      return saved && ['student', 'staff', 'warden'].includes(saved) ? saved : 'student';
    } catch {
      return 'student';
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('LD-1001');
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to sync complaints to localStorage', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to sync notifications to localStorage', e);
    }
  }, [notifications]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    if (role === 'student') {
      setActiveTab('dashboard');
    } else if (role === 'staff') {
      setActiveTab('staff_dashboard');
    } else if (role === 'warden') {
      setActiveTab('warden_overview');
    }
    showToast(`Switched active view to ${role.toUpperCase()} role`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENT);
      return saved ? JSON.parse(saved) : CURRENT_STUDENT;
    } catch {
      return CURRENT_STUDENT;
    }
  });

  // Sync currentStudent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(currentStudent));
    } catch (e) {
      console.error('Failed to sync student profile to localStorage', e);
    }
  }, [currentStudent]);

  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setCurrentStudent((prev) => ({ ...prev, ...updated }));
    showToast(`Profile username updated to ${updated.name || currentStudent.name}`, 'success');
  };

  // Compute active order for student view (most recent uncollected order, or latest order)
  const activeOrder = orders.find(
    (o) => o.studentId === currentStudent.studentId && !o.isCollected
  ) || orders.find((o) => o.studentId === currentStudent.studentId) || orders[0];

  const createOrder = (orderData: {
    studentName: string;
    studentId: string;
    hostel: string;
    roomNo: string;
    phone: string;
    totalItems: number;
    itemBreakdown: LaundryOrder['itemBreakdown'];
    specialCare?: string;
    notes?: string;
    estimatedDays?: number;
  }): LaundryOrder => {
    // Generate order ID
    const nextNum = 1000 + orders.length + 1;
    const orderId = `LD-${nextNum}`;

    // Generate random 4-digit verification PIN
    const collectionPin = Math.floor(1000 + Math.random() * 9000).toString();

    const now = new Date();
    const submissionDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const estimatedDate = new Date(now.getTime() + (orderData.estimatedDays || 2) * 24 * 60 * 60 * 1000);
    const expectedCollectionDate = estimatedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, 05:00 PM`;

    const initialTimeline = STATUS_STEPS.map((step, idx) => ({
      status: step.status,
      label: step.label,
      description: step.description,
      timestamp: idx === 0 ? submissionDate : `Est: ${idx <= 3 ? 'In progress' : expectedCollectionDate}`,
      isDone: idx === 0,
      isCurrent: idx === 0,
      updatedBy: idx === 0 ? 'Digital Intake System (LPU Counter)' : undefined,
    }));

    const newOrder: LaundryOrder = {
      id: orderId,
      studentName: orderData.studentName,
      studentId: orderData.studentId,
      hostel: orderData.hostel,
      roomNo: orderData.roomNo,
      phone: orderData.phone,
      totalItems: orderData.totalItems,
      itemBreakdown: orderData.itemBreakdown,
      specialCare: orderData.specialCare || '',
      notes: orderData.notes || '',
      status: 'received',
      submissionDate,
      expectedCollectionDate,
      collectionPin,
      isCollected: false,
      timeline: initialTimeline,
      lastUpdated: submissionDate,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Add notification
    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Laundry Request Registered: ${orderId}`,
      message: `Your ${orderData.totalItems} clothes have been received. Your pickup PIN is ${collectionPin}.`,
      timestamp: submissionDate,
      type: 'success',
      read: false,
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Order ${orderId} submitted! Secure Pickup PIN: ${collectionPin}`, 'success');

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    newStatus: LaundryStatus,
    note?: string,
    revisedDate?: string,
    delayReason?: string
  ) => {
    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const statusOrder: LaundryStatus[] = [
      'received',
      'sorting',
      'washing',
      'drying',
      'ready_for_pickup',
      'collected',
    ];
    const targetIdx = statusOrder.indexOf(newStatus);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = order.timeline.map((step) => {
          const stepIdx = statusOrder.indexOf(step.status);
          const isDone = stepIdx < targetIdx || (stepIdx === targetIdx && newStatus === 'collected');
          const isCurrent = stepIdx === targetIdx && newStatus !== 'collected';

          let updatedTimestamp = step.timestamp;
          if (stepIdx === targetIdx) {
            updatedTimestamp = timestampStr;
          }

          return {
            ...step,
            isDone,
            isCurrent,
            timestamp: updatedTimestamp,
            note: stepIdx === targetIdx && note ? note : step.note,
            updatedBy: stepIdx === targetIdx ? 'Laundry Operator (Staff)' : step.updatedBy,
          };
        });

        const isDelayed = delayReason ? true : order.isDelayed;

        return {
          ...order,
          status: newStatus,
          lastUpdated: timestampStr,
          timeline: updatedTimeline,
          isDelayed,
          delayReason: delayReason || order.delayReason,
          revisedExpectedDate: revisedDate || order.revisedExpectedDate,
          isCollected: newStatus === 'collected',
          collectedAt: newStatus === 'collected' ? timestampStr : order.collectedAt,
        };
      })
    );

    // Notify student
    const notifMsg = delayReason
      ? `Order ${orderId} status updated to ${newStatus.replace('_', ' ').toUpperCase()}. Note: Delayed due to "${delayReason}".`
      : `Order ${orderId} is now ${newStatus.replace(/_/g, ' ').toUpperCase()}.`;

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Status Update: ${orderId}`,
      message: notifMsg,
      timestamp: timestampStr,
      type: delayReason ? 'warning' : newStatus === 'ready_for_pickup' ? 'success' : 'info',
      read: false,
      orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Order ${orderId} updated to ${newStatus.replace(/_/g, ' ').toUpperCase()}`, 'success');
  };

  const verifyAndCollect = (orderId: string, enteredPin: string): { success: boolean; message: string } => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found in database.' };
    }

    if (order.isCollected) {
      return { success: false, message: 'This laundry order has already been handed over and collected.' };
    }

    if (order.collectionPin.trim() !== enteredPin.trim()) {
      return { success: false, message: 'Incorrect 4-digit PIN! Collection verification failed.' };
    }

    // Success: mark as collected
    updateOrderStatus(
      orderId,
      'collected',
      `Handover verified via 4-digit PIN #${enteredPin} at central collection counter.`
    );

    return {
      success: true,
      message: `Verified! PIN matched for ${order.studentName}. Clothes handed over successfully.`,
    };
  };

  const createComplaint = (data: {
    orderId: string;
    category: Complaint['category'];
    description: string;
    preferredResolution: string;
  }): Complaint => {
    const order = orders.find((o) => o.id === data.orderId);
    const cmpNum = 800 + complaints.length + 1;
    const cmpId = `CMP-${cmpNum}`;

    const now = new Date();
    const submittedAt = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    const newComplaint: Complaint = {
      id: cmpId,
      orderId: data.orderId,
      studentName: order?.studentName || currentStudent.name,
      studentId: order?.studentId || currentStudent.studentId,
      hostel: order?.hostel || currentStudent.hostel,
      roomNo: order?.roomNo || currentStudent.roomNo,
      category: data.category,
      description: data.description,
      preferredResolution: data.preferredResolution,
      status: 'submitted',
      submittedAt,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Complaint Logged: ${cmpId}`,
      message: `Your complaint regarding ${data.orderId} has been escalated to Hostel Warden Dr. Sanjeev Gupta.`,
      timestamp: submittedAt,
      type: 'warning',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Complaint ${cmpId} registered and sent to Warden`, 'success');

    return newComplaint;
  };

  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    wardenNote?: string
  ) => {
    const now = new Date();
    const timestampStr = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + `, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: newStatus,
          wardenNote: wardenNote !== undefined ? wardenNote : c.wardenNote,
          resolvedAt: newStatus === 'resolved' ? timestampStr : c.resolvedAt,
        };
      })
    );

    const newNotif: SystemNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Complaint Status: ${complaintId}`,
      message: `Warden updated status to ${newStatus.toUpperCase()}.${wardenNote ? ` Note: ${wardenNote}` : ''}`,
      timestamp: timestampStr,
      type: newStatus === 'resolved' ? 'success' : 'info',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Complaint ${complaintId} updated to ${newStatus.toUpperCase()}`, 'success');
  };

  const resetDemoData = () => {
    setOrders(INITIAL_ORDERS);
    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRoleState('student');
    setActiveTab('dashboard');
    setSelectedOrderId('LD-1001');
    setCurrentStudent(CURRENT_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.STUDENT);
    showToast('Demo data restored to initial benchmark state!', 'info');
  };

  return (
    <LaundryContext.Provider
      value={{
        orders,
        complaints,
        notifications,
        currentRole,
        setCurrentRole,
        currentStudent,
        activeOrder,
        activeTab,
        setActiveTab,
        selectedOrderId,
        setSelectedOrderId,
        createOrder,
        updateOrderStatus,
        verifyAndCollect,
        createComplaint,
        updateComplaintStatus,
        resetDemoData,
        updateStudentProfile,
        markNotificationAsRead,
        toasts,
        showToast,
        removeToast,
        isGuideModalOpen,
        setIsGuideModalOpen,
      }}
    >
      {children}
    </LaundryContext.Provider>
  );
};

export const useLaundry = () => {
  const context = useContext(LaundryContext);
  if (!context) {
    throw new Error('useLaundry must be used within a LaundryProvider');
  }
  return context;
};
