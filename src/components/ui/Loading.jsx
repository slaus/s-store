'use client';
import React from 'react';
import styles from './loading.module.css';
import { useTranslations } from 'next-intl';

const Loading = () => {
  const t = useTranslations('common');

  return <div className={styles._}>{t('loading')}</div>;
};

export default Loading;