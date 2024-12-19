import { rest } from 'msw';
import { API_BASE_URL } from '../config';

export const handlers = [
  // Mock profile data
  rest.get(`${API_BASE_URL}/api/profile/:userId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: req.params.userId,
        displayName: 'Test User',
        email: 'test@example.com',
        savedTemplates: [],
        resumeVersions: [],
      })
    );
  }),

  // Mock template saving
  rest.post(`${API_BASE_URL}/api/profile/:userId/templates`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: Date.now().toString(),
        ...req.body,
      })
    );
  }),

  // Mock resume version saving
  rest.post(`${API_BASE_URL}/api/profile/:userId/versions`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: Date.now().toString(),
        ...req.body,
      })
    );
  }),
];
