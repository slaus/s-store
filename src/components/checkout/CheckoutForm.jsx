import React, { useState, useEffect, useRef } from "react";
import checkoutForm from "@styles/CheckoutForm.module.css";
import {
  BiUser,
  BiPhone,
  BiMap,
  BiMapAlt,
  BiAnchor,
  BiMessage,
} from "react-icons/bi";
import SliderCheckbox from "@/components/ui/SliderCheckbox";
import {
  useDelivery,
  useFormState,
  useOrderDetails,
} from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { getFormValidations } from "../../utils/helpers";
import ModalAlert from "@/components/others/ModalAlert";
import Overlay from "@/components/others/Overlay";
import Modal from "@/components/ui/Modal";
import { useTranslations } from 'next-intl';

const CheckoutForm = () => {
  const t = useTranslations('checkout');
  const v = useTranslations('validation');
  const validations = getFormValidations(v);

  const { setFormState } = useFormState();
  const { cartItems } = useOrderDetails();
  const { delivery, setDelivery } = useDelivery();
  const [checked, setChecked] = useState(delivery);
  const [phoneDisplay, setPhoneDisplay] = useState("");
  const phoneInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  register("phone", validations.phone);

  useEffect(() => {
    setChecked(delivery);
  }, [delivery]);

  const handlePhoneFocus = () => {
    if (!phoneDisplay || phoneDisplay === "+380") {
      setPhoneDisplay("+380");
      setValue("phone", "+380", { shouldValidate: false });
    }
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let digits = input.replace(/\D/g, "");
    
    if (digits.startsWith("380")) {
      digits = digits.slice(3);
    }
    if (digits.length > 9) digits = digits.slice(0, 9);
    
    const formatted = `+380${digits}`;
    setPhoneDisplay(formatted);
    setValue("phone", formatted, { shouldValidate: true });
    trigger("phone");
  };

  const handlePhoneBlur = () => {
    trigger("phone");
  };

  const [showModal, setModal] = useState(false);
  const toggleChecked = () => {
    if (cartItems.length === 0) return;
    setChecked(!checked);
    setDelivery(!delivery);
  };

  const onSubmit = (formState) => {
    setFormState(formState);
    setModal(true);
  };

  return (
    <>
      <div className={checkoutForm._}>
        <h3 className={checkoutForm.title}>{t('your_data')}</h3>
        <form className={checkoutForm.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={checkoutForm.delivery}>
            <div className={checkoutForm.label}>{t('is_delivery')}</div>
            <SliderCheckbox checked={checked} toggleChecked={toggleChecked} />
          </div>

          <div className={`${checkoutForm.group} ${errors?.name ? checkoutForm.err : ""} ${cartItems.length === 0 ? checkoutForm.disabled : ""}`}>
            <div className={checkoutForm.icon}>
              <BiUser size={20} />
            </div>
            <input
              type="text"
              placeholder={t('name')}
              className={checkoutForm.input}
              disabled={cartItems.length === 0}
              {...register("name", validations.name)}
            />
            {errors?.name && <p className={checkoutForm.error}>{errors.name.message}</p>}
          </div>

          <div className={`${checkoutForm.group} ${errors?.phone ? checkoutForm.err : ""} ${cartItems.length === 0 ? checkoutForm.disabled : ""}`}>
            <div className={checkoutForm.icon}>
              <BiPhone size={20} />
            </div>
            <input
              type="tel"
              placeholder="+380XXXXXXXXX"
              className={checkoutForm.input}
              disabled={cartItems.length === 0}
              value={phoneDisplay}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              onBlur={handlePhoneBlur}
            />
            {errors?.phone && <p className={checkoutForm.error}>{errors.phone.message}</p>}
          </div>

          {delivery && (
            <>
              <div className={`${checkoutForm.group} ${errors?.address ? checkoutForm.err : ""}`}>
                <div className={checkoutForm.icon}>
                  <BiMap size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('stock')}
                  className={checkoutForm.input}
                  {...register("address", validations.address)}
                />
                {errors?.address && <p className={checkoutForm.error}>{errors.address.message}</p>}
              </div>
              <div className={`${checkoutForm.group} ${errors?.city ? checkoutForm.err : ""}`}>
                <div className={checkoutForm.icon}>
                  <BiMapAlt size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('city')}
                  className={checkoutForm.input}
                  {...register("city", validations.city)}
                />
                {errors?.city && <p className={checkoutForm.error}>{errors.city.message}</p>}
              </div>
              <div className={`${checkoutForm.group} ${errors?.schedule ? checkoutForm.err : ""}`}>
                <div className={checkoutForm.icon}>
                  <BiAnchor size={20} />
                </div>
                <input
                  type="text"
                  placeholder={t('area')}
                  className={checkoutForm.input}
                  {...register("schedule", validations.schedule)}
                />
                {errors?.schedule && <p className={checkoutForm.error}>{errors.schedule.message}</p>}
              </div>
            </>
          )}

          <div className={`${checkoutForm.group} ${errors?.comment ? checkoutForm.err : ""} ${cartItems.length === 0 ? checkoutForm.disabled : ""}`}>
            <div className={checkoutForm.icon}>
              <BiMessage size={20} />
            </div>
            <input
              type="text"
              placeholder={t('comment')}
              className={checkoutForm.input}
              disabled={cartItems.length === 0}
              {...register("comment", validations.comment)}
            />
            {errors?.comment && <p className={checkoutForm.error}>{errors.comment.message}</p>}
          </div>

          <button type="submit" className={checkoutForm.confirm} disabled={cartItems.length === 0}>
            {t('checkout')}
          </button>
        </form>
      </div>

      {showModal && (
        <Overlay>
          <Modal setIsModalOpen={setModal}>
            <ModalAlert showModal={showModal} setModal={setModal} />
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default CheckoutForm;