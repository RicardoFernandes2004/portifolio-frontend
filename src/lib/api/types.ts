export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  tokenExpiresAt: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceDto {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string | null;
}
export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export interface Education {
  id: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationDto {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
}
export type UpdateEducationDto = Partial<CreateEducationDto>;

export interface Skill {
  id: number;
  name: string;
  level: number;
  description: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillDto {
  name: string;
  level: number;
  description?: string | null;
  icon?: string | null;
}
export type UpdateSkillDto = Partial<CreateSkillDto>;

export interface Language {
  id: number;
  name: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  name: string;
  level: number;
}
export type UpdateLanguageDto = Partial<CreateLanguageDto>;

export interface Project {
  id: number;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  link: string | null;
  githubLink: string | null;
  youtubeLink: string | null;
  instagramLink: string | null;
  twitterLink: string | null;
  facebookLink: string | null;
  collaborators: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  description: string;
  images?: string[];
  technologies?: string[];
  link?: string | null;
  githubLink?: string | null;
  youtubeLink?: string | null;
  instagramLink?: string | null;
  twitterLink?: string | null;
  facebookLink?: string | null;
  collaborators?: string[];
}
export type UpdateProjectDto = Partial<CreateProjectDto>;

export interface ResumeHeader {
  id: number;
  name: string;
  jobTitle: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateResumeHeaderDto = Partial<
  Omit<ResumeHeader, "id" | "createdAt" | "updatedAt">
>;

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
}
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface Post {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  categoryId: number;
  category: Category | null;
  publishedAt: string | null;
  isPublished: boolean;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  authorName: string;
  content: string;
  status: "PUBLISHED" | "PENDING";
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  authorName: string;
  content: string;
  authorEmail?: string | null;
  parentId?: number | null;
}

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface ViewResponse {
  viewCount: number;
}

export interface CreatePostDto {
  title: string;
  summary: string;
  content: string;
  categoryId: number;
  slug?: string;
  images?: string[];
  publishedAt?: string | null;
}
export type UpdatePostDto = Partial<CreatePostDto>;
