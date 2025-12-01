export interface Board {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  user_id: string;
  color: string;
  updated_at: string;
}
export type ColumnWithTasks = Column & {
  tasks: Task[]
};


export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assigned: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  title: string;
  board_id: string;
  created_at: string;
  sort_order: number;
  user_id: string;
}

export interface Team {
  id: string;
  name: string;
  creator_id: string;
  created_at: string;
  description: string | null;
  type: string;
  color: string;

}
