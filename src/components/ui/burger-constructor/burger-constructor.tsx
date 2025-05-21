import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
  orderError
}) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // Управление состоянием модальных окон
  useEffect(() => {
    if (orderRequest) {
      setShowLoadingModal(true);
      setShowOrderModal(false);
    } else if (orderModalData) {
      setShowLoadingModal(false);
      setShowOrderModal(true);
    } else {
      setShowLoadingModal(false);
      setShowOrderModal(false);
    }
  }, [orderRequest, orderModalData]);

  return (
    <section className={styles.burger_constructor} data-cy='constructor-module'>
      {constructorItems.bun ? (
        <div className={`${styles.element} mb-4 mr-4`}>
          <ConstructorElement
            type='top'
            isLocked
            text={`${constructorItems.bun.name} (верх)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}
      <ul className={styles.elements}>
        {constructorItems.ingredients.length > 0 ? (
          constructorItems.ingredients.map(
            (item: TConstructorIngredient, index: number) => (
              <BurgerConstructorElement
                ingredient={item}
                index={index}
                totalItems={constructorItems.ingredients.length}
                key={item.id}
              />
            )
          )
        ) : (
          <li
            className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          >
            Выберите начинку
          </li>
        )}
      </ul>
      {constructorItems.bun ? (
        <div className={`${styles.element} mt-4 mr-4`}>
          <ConstructorElement
            type='bottom'
            isLocked
            text={`${constructorItems.bun.name} (низ)`}
            price={constructorItems.bun.price}
            thumbnail={constructorItems.bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите булки
        </div>
      )}
      <div className={`${styles.total} mt-10 mr-4`}>
        <div className={`${styles.cost} mr-10`}>
          <p className={`text ${styles.text} mr-2`}>{price}</p>
          <CurrencyIcon type='primary' />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          children='Оформить заказ'
          onClick={onOrderClick}
          disabled={orderRequest}
        />
      </div>

      {showLoadingModal && (
        <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
          <div className={styles.loading_container}>
            <Preloader />
            <p className='text text_type_main-default mt-4'>
              Пожалуйста, подождите...
            </p>
          </div>
        </Modal>
      )}

      {showOrderModal && orderModalData && (
        <Modal onClose={closeOrderModal} title={''}>
          <OrderDetailsUI orderNumber={orderModalData.number} />
        </Modal>
      )}

      {orderError && (
        <Modal onClose={closeOrderModal} title={'Ошибка'}>
          <div className={styles.error_container}>
            <p className='text text_type_main-default' style={{ color: 'red' }}>
              {orderError}
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
};
