import { nanoid } from "nanoid";

//fetcher
export const fetcher = (url) => fetch(url).then((r) => r.json());

export const getFormValidations = (v) => {
  return {
    name: {
      required: {
        value: true,
        message: v('name'),
      },
      maxLength: {
        value: 30,
        message: v('name_max'),
      },
      minLength: {
        value: 5,
        message: v('name_min'),
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄє]{2,}(?:\s+[A-Za-zА-Яа-яІіЇїЄє]{2,})+$/,
        message: v('name_pattern'),
      },
    },
    phone: {
      required: {
        value: true,
        message: v('phone'),
      },
      maxLength: {
        value: 13,
        message: v('phone_max'),
      },
      minLength: {
        value: 13,
        message: v('phone_min'),
      },
      phone: {
        required: { value: true, message: v('phone') },
        pattern: {
          value: /^\+380\d{9}$/,
          message: v('phone_pattern'),
        },
      },
    },
    address: {
      required: {
        value: true,
        message: v('delivery'),
      },
      maxLength: {
        value: 20,
        message: v('delivery_max'),
      },
      minLength: {
        value: 1,
        message: v('delivery_min'),
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄє ]{1,20}$/,
        message: v('delivery_pattern'),
      },
    },
    city: {
      required: {
        value: true,
        message: v('city'),
      },
      maxLength: {
        value: 20,
        message: v('city_max'),
      },
      minLength: {
        value: 3,
        message: v('city_min'),
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄє ]{3,20}$/,
        message: v('city_pattern'),
      },
    },
    schedule: {
      // required: {
      //   value: true,
      //   message: "Schedule is required",
      // },
      maxLength: {
        value: 20,
        message: v('schedule_max'),
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄє ]{0,20}$/,
        message: v('schedule_pattern'),
      },
    },
    comment: {
      maxLength: {
        value: 30,
        message: v('comment_max'),
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

  // Поточна дата у форматі "09.04.2025, 14:10"
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

  let cartListforUrl = "";

  Object.values(cartItems).forEach((item) => {
    const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
    cartListforUrl += `%0A%0A - *(${item.qty})* ${item.title} --> _*${itemTotal} грн.*_`;
  });

  const WSP_URL = `https://web.whatsapp.com/send/?phone=${N}&text=%2AДата%3A%2A%20${formattedDate}%0A%0A%2AЗамовлення%3A%2A%20${ID}%0A%0A%2AКлієнт%3A%2A%20${name}%0A%0A%2AТелефон%3A%2A%20${phone}%0A%0A%2A${withDelivery ? "Нова_Пошта" + "%3A%2A%20" + address + " склад %0A%0A%2A" : ""
    }${withDelivery ? "Місто" + "%3A%2A%20" + city + "%0A%0A%2A" : ""}${withDelivery ? "Область_район" + "%3A%2A%20" + schedule + "%0A%0A%2A" : ""
    }${comment ? "Коментар" + "%3A%2A%20" + comment + "%0A%0A%2A" : ""}${"Список_замовлення"}%3A%2A${cartListforUrl}%0A%0A%2A${withDelivery ? "Підсумок" + "%3A%2A%20" + subTotal + " грн.%0A%0A%2A" : ""
    }${withDelivery ? "Вартість_доставки" + "%3A%2A%20" + shippingCost + " грн.%0A%0A%2A" : ""}${"Загальна_сума"}%3A%2A%20${total} грн.%0A%0A`;

  return WSP_URL;
}


// send order in telegram
export async function sendTelegramOrder(orderData) {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_MY_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_MY_TELEGRAM_CHAT_ID;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, total, formData } = orderData;
  const { name, phone, address, city, schedule, comment } = formData;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

  let cartList = '';
  Object.values(cartItems).forEach((item) => {
    const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(0);
    cartList += `\n- ${item.title} --> ${itemTotal} грн. *(${item.qty} шт.)*`;
  });

  const message = `
📅 *Дата:* ${formattedDate}
🛒 *Замовлення:* ${ID}
👤 *Клієнт:* ${name}
📞 *Телефон:* ${phone}
${withDelivery ? `🏠 *Нова Пошта:* ${address} склад\n🏙 *Місто:* ${city}\n⚓ *Область, район:* ${schedule}` : ''}
${comment ? `💬 *Коментар:* ${comment}` : ''}

🧾 *Список замовлення:* ${cartList}

💰 *Підсумок:* ${subTotal} грн.
🚚 *Вартість доставки:* ${withDelivery ? shippingCost : 0} грн.
💵 *Загальна сума:* ${total} грн.
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
