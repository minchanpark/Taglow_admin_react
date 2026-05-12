import type { AdminService } from './adminService';

export class OpenApiAdminService implements AdminService {
  constructor() {
    throw new Error('OpenApiAdminService is not connected in the Mock MVP.');
  }

  signup: AdminService['signup'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  login: AdminService['login'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchCurrentUser: AdminService['fetchCurrentUser'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  logout: AdminService['logout'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchVotes: AdminService['fetchVotes'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  createVote: AdminService['createVote'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchVote: AdminService['fetchVote'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  updateVote: AdminService['updateVote'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  deleteVote: AdminService['deleteVote'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchQuestions: AdminService['fetchQuestions'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  createQuestion: AdminService['createQuestion'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  updateQuestion: AdminService['updateQuestion'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  deleteQuestion: AdminService['deleteQuestion'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchPublicVoteDisplay: AdminService['fetchPublicVoteDisplay'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
  fetchPublicQuestions: AdminService['fetchPublicQuestions'] = async () => {
    throw new Error('Real API service is not implemented yet.');
  };
}
