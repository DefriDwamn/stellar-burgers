import '../../index.css';
import styles from './app.module.css';
import {
  Feed,
  NotFound404,
  ConstructorPage,
  Login,
  ResetPassword,
  Register,
  ForgotPassword,
  ProfileOrders,
  Profile
} from '@pages';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { useDispatch } from '../../services/store';
import { verifyUser } from '../../services/slices/profileUserSlice';
import { FC } from 'react';

type ModalRoute = {
  path: string;
  title: string;
  redirectPath: string;
  component: FC;
};

type ProtectedRouteConfig = {
  path: string;
  element: FC;
  anonymous?: boolean;
};

// Конфигурация модальных окон
const MODAL_ROUTES: ModalRoute[] = [
  {
    path: '/feed/:number',
    title: 'Детали заказа',
    redirectPath: '/feed',
    component: OrderInfo
  },
  {
    path: '/ingredients/:id',
    title: 'Детали ингредиента',
    redirectPath: '/',
    component: IngredientDetails
  },
  {
    path: '/profile/orders/:number',
    title: 'Детали заказа',
    redirectPath: '/profile/orders',
    component: OrderInfo
  }
];

// Конфигурация защищенных маршрутов
const PROTECTED_ROUTES: ProtectedRouteConfig[] = [
  {
    path: '/login',
    element: Login,
    anonymous: true
  },
  {
    path: '/forgot-password',
    element: ForgotPassword,
    anonymous: true
  },
  {
    path: '/register',
    element: Register,
    anonymous: true
  },
  {
    path: '/reset-password',
    element: ResetPassword,
    anonymous: true
  },
  {
    path: '/profile',
    element: Profile
  },
  {
    path: '/profile/orders',
    element: ProfileOrders
  }
];

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundPosition = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(verifyUser());
  }, [dispatch]);

  const renderModalRoute = (
    path: string,
    title: string,
    onClose: () => void,
    children: JSX.Element
  ) => (
    <Route
      path={path}
      element={
        <Modal title={title} onClose={onClose}>
          {children}
        </Modal>
      }
    />
  );

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundPosition || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {PROTECTED_ROUTES.map(({ path, element: Element, anonymous }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute anonymous={anonymous}>
                <Element />
              </ProtectedRoute>
            }
          />
        ))}

        {MODAL_ROUTES.map(
          ({ path, title, redirectPath, component: Component }) =>
            renderModalRoute(
              path,
              title,
              () => navigate(redirectPath),
              <Component />
            )
        )}

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundPosition && (
        <Routes>
          {MODAL_ROUTES.map(
            ({ path, title, redirectPath, component: Component }) =>
              renderModalRoute(
                path,
                title,
                () => navigate(redirectPath),
                <Component />
              )
          )}
        </Routes>
      )}
    </div>
  );
};

export default App;
