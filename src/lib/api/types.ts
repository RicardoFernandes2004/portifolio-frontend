export interface User {
  id: number;
  username: string;
  email: string;
  twoFactorEnabled?: boolean;
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
  positionEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExperienceDto {
  company: string;
  position: string;
  positionEn?: string | null;
  description: string;
  descriptionEn?: string | null;
  startDate: string;
  endDate?: string | null;
}
export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export interface Education {
  id: number;
  school: string;
  degree: string;
  degreeEn?: string | null;
  fieldOfStudy: string;
  fieldOfStudyEn?: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEducationDto {
  school: string;
  degree: string;
  degreeEn?: string | null;
  fieldOfStudy: string;
  fieldOfStudyEn?: string | null;
  startDate: string;
  endDate?: string | null;
}
export type UpdateEducationDto = Partial<CreateEducationDto>;

export interface Skill {
  id: number;
  name: string;
  level: number;
  description: string | null;
  descriptionEn?: string | null;
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillDto {
  name: string;
  level: number;
  description?: string | null;
  descriptionEn?: string | null;
  icon?: string | null;
}
export type UpdateSkillDto = Partial<CreateSkillDto>;

export interface Language {
  id: number;
  name: string;
  nameEn?: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  name: string;
  nameEn?: string | null;
  level: number;
}
export type UpdateLanguageDto = Partial<CreateLanguageDto>;

export interface Project {
  id: number;
  title: string;
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
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
  titleEn?: string | null;
  description: string;
  descriptionEn?: string | null;
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
  jobTitleEn?: string | null;
  summary: string;
  summaryEn?: string | null;
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
  nameEn?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  nameEn?: string | null;
}
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface Post {
  id: number;
  slug: string;
  title: string;
  titleEn?: string | null;
  summary: string;
  summaryEn?: string | null;
  content: string;
  contentEn?: string | null;
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
  titleEn?: string | null;
  summary: string;
  summaryEn?: string | null;
  content: string;
  contentEn?: string | null;
  categoryId: number;
  slug?: string;
  images?: string[];
  publishedAt?: string | null;
}
export type UpdatePostDto = Partial<CreatePostDto>;

/** Autorização de upload direto ao storage (formato agnóstico de provedor). */
export interface UploadTicket {
  uploadUrl: string;
  fields: Record<string, string>;
  fileField: string;
  publicUrl: string;
}
