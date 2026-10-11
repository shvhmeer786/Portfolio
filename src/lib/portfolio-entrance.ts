export function shouldPlayEntrance({ pathname, reduced, welcomed, navigationType, hash }: {
  pathname: string; reduced: boolean; welcomed: boolean; navigationType?: string; hash: string;
}) {
  return pathname === '/' && !reduced && !hash && (!welcomed || navigationType === 'reload');
}
