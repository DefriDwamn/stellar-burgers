import { TConstructorIngredient } from '@utils-types';
import { FC, useMemo, useEffect } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  getConstructorState
} from '../../services/slices/burgerConstructorSlice';
import {
  clearOrders,
  fetchOrders,
  selectOrders,
  selectquery,
  selectOrderError
} from '../../services/slices/ordersHistorySlice';
import { selectProfileUser } from '../../services/slices/profileUserSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorState);
  const orderRequest = useSelector(selectquery);
  const orderModalData = useSelector(selectOrders);
  const orderError = useSelector(selectOrderError);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(selectProfileUser);

  // Сброс заказа при размонтировании конструктора
  useEffect(
    () => () => {
      dispatch(clearOrders());
    },
    [dispatch]
  );

  // Auto-clear error state after 5 seconds
  useEffect(() => {
    if (orderError) {
      const timer = setTimeout(() => {
        dispatch(clearOrders());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderError, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun) {
      return;
    }

    if (orderRequest) {
      return;
    }

    if (!user) {
      // Сохраняем текущий путь для возврата после авторизации
      navigate('/login', {
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }

    const orderIngredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];
    dispatch(fetchOrders(orderIngredients));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrders());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderError={orderError}
    />
  );
};
