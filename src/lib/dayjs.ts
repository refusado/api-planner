import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);
dayjs.locale('pt-br');

const formatDate = (date: Date): string => dayjs(date).format('LL');

export {
  dayjs,
  formatDate
}