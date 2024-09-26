/**
 * An interface to insert a child into a parent
 */
interface FileOptionChild {
  key: string;
  label: string;
  data: string;
  icon: string;
  children?: FileOptionChild[];
}

/**
 * An interface for file options
 */
export interface FileOption {
  key: string;
  label: string;
  data: string;
  icon: string;
  children: FileOptionChild[];
}
