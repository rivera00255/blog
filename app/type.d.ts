export type Posts = {
  id?: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  user: {
    uid: string;
    email: string;
    username: string;
  };
};

export type Comments = {
  id?: string;
  text: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date;
  parent?: string;
  reply?: Comments[];
  user: {
    uid: string;
    email: string;
    username: string;
  };
};
