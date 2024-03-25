export type Posts = {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  user: {
    uid: string;
    email: string;
  };
};
