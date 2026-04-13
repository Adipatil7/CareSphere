// ── Enums ──
export type Role = 'PATIENT' | 'DOCTOR' | 'CHEMIST' | 'ADMIN';
export type AppointmentStatus = 'REQUESTED' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED';
export type SessionStatus = 'CREATED' | 'ACTIVE' | 'ENDED';
export type ReactionType = 'LIKE' | 'HELPFUL';

// ── Auth ──
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  verified: boolean;
  createdAt: string;
}

// ── Profile ──
export interface DoctorProfileResponse {
  userId: string;
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  bio: string;
}

export interface DoctorSearchResponse {
  userId: string;
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  bio: string;
}

export interface DoctorAvailabilityResponse {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateDoctorProfileRequest {
  licenseNumber: string;
  specialization: string;
  experienceYears: number;
  bio: string;
}

// ── Appointment ──
export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
}

export interface AppointmentResponse {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
}

// ── Consultation ──
export interface StartConsultRequest {
  appointmentId: string;
  doctorId: string;
  patientId: string;
}

export interface ConsultSessionResponse {
  id: string;
  appointmentId: string;
  roomId: string;
  doctorId: string;
  patientId: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
}

// ── Records ──
export interface CreateVisitRequest {
  consultId: string;
  doctorId: string;
  patientId: string;
  notes: string;
}

export interface VisitResponse {
  id: string;
  consultId: string;
  doctorId: string;
  patientId: string;
  notes: string;
  createdAt: string;
  prescription?: PrescriptionResponse;
}

export interface CreatePrescriptionRequest {
  visitId: string;
  medicines: MedicineRequest[];
}

export interface MedicineRequest {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionResponse {
  id: string;
  visitId: string;
  status: string;
  createdAt: string;
  medicines: MedicineResponse[];
}

export interface MedicineResponse {
  id: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
}

// ── Pharmacy ──
export interface InventoryResponse {
  id: string;
  chemistId: string;
  medicineName: string;
  quantity: number;
  lastUpdated: string;
}

// ── Content ──
export interface Post {
  id: string;
  authorId: string;
  role: string;
  category: string;
  title: string;
  content: string;
  approved: boolean;
  createdAt: string;
  comments?: Comment[];
  reactions?: PostReaction[];
}

export interface CreatePostRequest {
  authorId: string;
  role: string;
  category: string;
  title: string;
  content: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  userId: string;
  text: string;
}

export interface PostReaction {
  id: string;
  postId: string;
  userId: string;
  reactionType: string;
}

export interface ReactToPostRequest {
  userId: string;
  reactionType: ReactionType;
}

export interface Question {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
  answers?: Answer[];
}

export interface CreateQuestionRequest {
  userId: string;
  title: string;
  description: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  createdAt: string;
}

export interface CreateAnswerRequest {
  userId: string;
  answer: string;
}

// ── JWT Payload ──
export interface JwtPayload {
  sub: string;
  role: Role;
  exp: number;
  iat: number;
}
