type PublicMetadata = {
  role?: string;
};

export const isAdmin = (publicMetadata: PublicMetadata): boolean => publicMetadata?.role === 'admin';
