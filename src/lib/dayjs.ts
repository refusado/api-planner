import dayjs from 'dayjs';
import 'dayjs/locale/pt-br.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

const formatDate = (date: Date): string => dayjs(date).format('LL');

export {
  dayjs,
  formatDate
};
