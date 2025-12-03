type PublicMetadata = {
  role?: string;
};

export const isAdmin = (publicMetadata: PublicMetadata): boolean =>
  publicMetadata?.role === 'admin';

export const isSuperAdmin = (publicMetadata: PublicMetadata): boolean =>
  publicMetadata?.role === 'superadmin';
