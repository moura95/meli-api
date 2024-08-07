export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface Subcategory {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  severity_id: number;
  category_id: number;
  user_id: number | null;
  subcategory_id: number;
  category: Category;
  subcategory: Subcategory;
  user: User;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}
