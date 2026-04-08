import { nanoid } from "nanoid";

//fetcher
export const fetcher = (url) => fetch(url).then((r) => r.json());

export const getFormValidations = () => {
  return {
    name: {
      required: {
        value: true,
        message: "Ім'я та прізвище обов'язкові",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 25 символів",
      },
      minLength: {
        value: 3,
        message: "Мінімальна довжина 6 символи",
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄє ]{6,25}$/,
        message: "Неправильне повне ім'я",
      },
    },
    phone: {
      required: {
        value: true,
        message: "Номер телефону обов'язковий",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      minLength: {
        value: 5,
        message: "Мінімальна довжина 9 символів",
      },
      pattern: {
        value: /^[0-9]{9,20}$/,
        message: "Неправильний номер телефон",
      },
    },
    address: {
      required: {
        value: true,
        message: "Нова Пошта обов'язкова",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      minLength: {
        value: 1,
        message: "Мінімальна довжина 1 символ",
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄє ]{1,20}$/,
        message: "Неправильний склад Нової Пошти",
      },
    },
    city: {
      required: {
        value: true,
        message: "Місто або селище обов'язкове",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      minLength: {
        value: 3,
        message: "Мінімальна довжина 3 символи",
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄє ]{3,20}$/,
        message: "Неправильне місто або селище",
      },
    },
    schedule: {
      // required: {
      //   value: true,
      //   message: "Schedule is required",
      // },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄє ]{0,20}$/,
        message: "Неправильна область, район",
      },
    },
    comment: {
      maxLength: {
        value: 30,
        message: "Максимальна довжина 30 символів",
      },
    },
  };
};


//wsp url creator
export function getWspUrl(orderData) {
  const N = process.env.NEXT_PUBLIC_MY_PHONE_NUMBER;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, total, formData } = orderData;
  const { name, phone, address, city, schedule, comment } = formData;

  let cartListforUrl = "";

  {
    Object.values(cartItems).forEach((item) => {
      const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
      cartListforUrl += `%0A%0A - *(${item.qty})* ${item.title} --> _*$${itemTotal}*_`;
    });
  }

  const WSP_URL = `https://web.whatsapp.com/send/?phone=${N}&text=%2A${"Замовлення"}%3A%2A%20${ID}%0A%0A%2A${"Клієнт"}%3A%2A%20${name}%0A%0A%2A${"Телефон"}%3A%2A%20${phone}%0A%0A%2A${
    withDelivery ? "Нова_Пошта" + "%3A%2A%20" + address + " %0A%0A%2A" : ""
  }${withDelivery ? "Місто" + "%3A%2A%20" + city + "%0A%0A%2A" : ""}${
    withDelivery ? "Область_район" + "%3A%2A%20" + schedule + "%0A%0A%2A" : ""
  }${comment ? "Коментар" + "%3A%2A%20" + comment + "%0A%0A%2A" : ""}${"Список_замовлення"}%3A%2A${cartListforUrl}%0A%0A%2A${
    withDelivery ? "Підсумок" + "%3A%2A%20$" + subTotal + " %0A%0A%2A" : ""
  }${withDelivery ? "Вартість_доставки" + "%3A%2A%20$" + shippingCost + " %0A%0A%2A" : ""}${"Загальна_сума"}%3A%2A%20${total}%0A%0A`;

  return WSP_URL;
}


// send order in telegram
export async function sendTelegramOrder(orderData) {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_MY_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_MY_TELEGRAM_CHAT_ID;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, total, formData } = orderData;
  const { name, phone, address, city, schedule, comment } = formData;

  let cartList = '';
  Object.values(cartItems).forEach((item) => {
    const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
    cartList += `\n- (${item.qty}) ${item.title} --> $${itemTotal}`;
  });

  const message = `
🛒 *Замовлення:* ${ID}
👤 *Клієнт:* ${name}
📞 *Телефон:* ${phone}
${withDelivery ? `🏠 *Нова Пошта:* ${address}\n🏙 *Місто:* ${city}\n🕐 *Область, район:* ${schedule}` : ''}
${comment ? `💬 *Коментар:* ${comment}` : ''}
🧾 *Список замовлення:* ${cartList}

💰 *Підсумок:* $${subTotal}
🚚 *Вартість доставки:* $${withDelivery ? shippingCost : 0}
💵 *Загальна сума:* $${total}
  `;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}
