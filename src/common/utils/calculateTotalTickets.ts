import { PaymentStatus } from "src/modules/payment/entities/payment.entity";

export const calculateTotalTickets = (concert: any): number => {
  return (
    concert.bookings
      ?.filter((b) => b.payment?.status === PaymentStatus.SUCCESS)
      .reduce((sum, b) => sum + b.ticket_quantity, 0) || 0
  );
}
