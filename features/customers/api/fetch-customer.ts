import { getCustomerById } from "@/features/shared/data/fixtures";
import { simulateLatency } from "@/features/shared/api/simulate-latency";

export async function fetchCustomer(id: string) {
  await simulateLatency(80);
  const customer = getCustomerById(id);
  if (!customer) return null;
  return customer;
}
