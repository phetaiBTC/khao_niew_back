import { Concert } from "src/modules/concerts/entities/concert.entity";
import { PaymentStatus } from "src/modules/payment/entities/payment.entity";

export const calculateTotalTickets = (concert: Concert): number => {
  return (
    concert.bookings
      ?.filter((b) => b.payment.status !== PaymentStatus.FAILED)
      .reduce((sum, b) => sum + b.ticket_quantity, 0) || 0
  );
}
