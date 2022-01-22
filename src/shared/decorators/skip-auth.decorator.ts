import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublicRoute';
export const SkipAuth = () => SetMetadata(IS_PUBLIC_KEY, true);
