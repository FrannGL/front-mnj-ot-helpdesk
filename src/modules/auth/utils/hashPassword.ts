import bcryptjs from 'bcryptjs';

export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  try {
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear la contraseña');
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const isValid = await bcryptjs.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    throw new Error('Error al verificar la contraseña');
  }
}
