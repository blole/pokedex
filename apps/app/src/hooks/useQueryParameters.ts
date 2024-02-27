import { useSearchParams } from 'next/navigation';

export const encodeQueryParameter = (parameterValue: string): string => {
  return encodeURIComponent(parameterValue)
    .replaceAll('%20', '+')
    .replaceAll('%3A', ':')
    .replaceAll('%3C', '<')
    .replaceAll('%3D', '=')
    .replaceAll('%3E', '>');
};

export const decodeQueryParameter = (parameterValue: string): string => {
  return decodeURIComponent(parameterValue.replaceAll('+', '%20'));
};

export const useQueryParameters = <T extends string>(parameterNames: [T]): Record<T, string | null> => {
  const searchParams = useSearchParams();
  return parameterNames.reduce(
    (obj: Record<T, string | null>, parameterName: T) => {
      obj[parameterName] = searchParams.get(parameterName);
      return obj;
    },
    {} as Record<T, string | null>,
  );
};
