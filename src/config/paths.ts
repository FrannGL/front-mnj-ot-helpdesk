// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  ORDENES: '/ordenes',
  ADMIN: '/admin',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/login`,
      signUp: `${ROOTS.AUTH}/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
  },
  // ORDENES
  ordenesuser: {
    root: ROOTS.ORDENES,
  },
  // ADMIN
  admin: {
    root: ROOTS.ADMIN,
    ordenes: `${ROOTS.ADMIN}/ordenes`,
    usuarios: `${ROOTS.ADMIN}/usuarios`,
    grupos: `${ROOTS.ADMIN}/grupos`,
    tags: `${ROOTS.ADMIN}/tags`,
  },
};
