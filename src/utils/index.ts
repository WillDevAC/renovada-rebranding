import { format } from 'date-fns';


const formatDate = (dateString: string) => {

  const date = new Date(dateString);


  const formattedDate = format(date, 'dd/MM/yyyy');

  return formattedDate;
};


export default formatDate