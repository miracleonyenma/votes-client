// ./types/index.ts

type User = {
  id: number;
  documentId: string;
  username?: string;
  email?: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: null;
};

type RegsiterResponse = {
  user: User;
  jwt: string;
  instantdbToken: string;
};

type LoginResponse = RegsiterResponse;

type RegisterBody = {
  username: string;
  email: string;
  password: string;
};

type LoginBody = {
  identifier: string;
  password: string;
};

type Option = {
  id: number;
  documentId: string;
  value: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
};

type Vote = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  option: Option;
  user?: User;
};

type Poll = {
  id: number;
  documentId: string;
  question: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: null;
  options: Option[];
  votes: Vote[];
  user?: User;
};

type VoteData = {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  option: Option;
  poll: Poll;
};

type Meta = {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

type PollsResponse = {
  data: Poll[];
  meta: Meta;
};

type PollResponse = {
  data: Poll;
};

type OptionResponse = {
  data: Option;
};

type VotesResponse = {
  data: VoteData[];
  meta: Meta;
};

type VoteResponse = {
  data: VoteData;
};

type InstantDBVote = {
  user: {
    documentId: string;
    username: string;
    email: string;
  };
  poll: {
    question: string;
    documentId: string;
  };
  option: {
    value: string;
    documentId: string;
  };
  createdAt: string;
};

type InstantDBSchema = {
  votes: InstantDBVote;
};

export type {
  User,
  RegsiterResponse,
  LoginResponse,
  RegisterBody,
  LoginBody,
  Option,
  Vote,
  Poll,
  Meta,
  PollsResponse,
  PollResponse,
  OptionResponse,
  VotesResponse,
  VoteResponse,
  VoteData,
  InstantDBVote,
  InstantDBSchema,
};
