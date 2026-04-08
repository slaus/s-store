import React, { useState } from 'react';
import styles from "./item-card.module.css";
import Overlay from '@/components/others/Overlay';
import Modal from '@/components/ui/Modal';
import CounterBtn from '@/components/ui/CounterBtn';
import { useIsInCart  } from '@/context/AppContext';

const ItemsCard = ({ item }) => {

    const { title, price, img, offerPrice } = item;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const quantityInCart = useIsInCart(item);

    const openModal = () => {
        setIsModalOpen(!isModalOpen);
    }

    return (
        <>
            <div className={styles._}>
                {offerPrice && <div className={styles.sale}>Знижка</div>}
                <div className={styles.img} onClick={openModal}>
                    <img alt={title} title={title} src={`/images/${img}`} className={styles.pict} />
                </div>
                <div className={styles.block}>
                    <div className={styles.prices}>
                        <p className={styles.price}>{(offerPrice || price).toFixed(2)} грн.</p>
                        {offerPrice && <p className={styles.old}>{price.toFixed(2)} грн.</p>}
                    </div>
                    <p className={styles.title}>{title}</p>
                </div>
                <div className={styles.btns}>
                    <CounterBtn item={item} counter={quantityInCart} />
                </div>
            </div>
            {isModalOpen &&
                <Overlay>
                    <Modal setIsModalOpen={setIsModalOpen}>
                        <img alt={title} title={title} src={`/images/${img}`} />
                    </Modal>
                </Overlay>
            }
        </>
    );
};

export default ItemsCard;