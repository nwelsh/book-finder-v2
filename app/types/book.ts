export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  kindleUnlimited: boolean;
  libby: boolean;
}