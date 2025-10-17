// Sharing types for question threads and responses

export interface QuestionThread {
  id: string;
  question_id: string;
  sender_id: string;
  recipient_contact: string | null;
  recipient_id: string | null;
  status: 'pending' | 'answered';
  created_at: string;
  updated_at: string;
}

export interface QuestionResponse {
  id: string;
  thread_id: string;
  responder_id: string;
  response_text: string;
  created_at: string;
}

export interface ThreadWithDetails {
  thread_id: string;
  question_id: string;
  question_text: string;
  deck_name: string;
  sender_id: string;
  sender_name: string | null;
  recipient_id: string | null;
  recipient_name: string | null;
  recipient_contact: string | null;
  status: 'pending' | 'answered';
  response_text: string | null;
  response_created_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShareQuestionParams {
  questionId: string;
  questionText: string;
  senderId: string;
}

export interface CreateThreadResult {
  threadId: string;
  shareUrl: string;
  shareMessage: string;
}

