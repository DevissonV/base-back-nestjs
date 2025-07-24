/**
 * System role identifiers.
 *
 * Note:
 * Do NOT load these from .env – decorators like @Roles() are evaluated 
 * before ConfigService is available. Using dynamic values here would break guards.
 *
 * Use this enum for all role-based access control.
 */
export enum ROLES {
  ADMIN = 'admin',
  BODEGUERO = 'bodeguero',
  VENDEDOR = 'vendedor',
  SUPERADMIN = 'superAdmin',
}
