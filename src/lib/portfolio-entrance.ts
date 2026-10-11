export function shouldPlayEntrance({ pathname, reduced, hash }: {
  pathname: string; reduced: boolean; hash: string;
}) {
  return pathname === '/' && !reduced && !hash;
}
