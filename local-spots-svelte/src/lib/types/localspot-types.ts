export interface Session  {
  name: string;
  _id: string;
  token: string;
  isAdmin: boolean;
}


export interface User  {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};


export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  color?: string;
  isActive?: boolean;
  user?: string | User;
};


export interface LocalSpot {
  _id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  userid?: string; 
  category?: Category | string; //Expanded Object or String-ID
  img?: string;
  imagePublicId?: string;
};

