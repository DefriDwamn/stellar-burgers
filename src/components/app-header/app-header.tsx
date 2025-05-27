import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectProfileUser } from '../../services/slices/profileUserSlice';

export const AppHeader: FC = () => {
  const { user } = useSelector(selectProfileUser);
  return <AppHeaderUI userName={user?.name} />;
};
