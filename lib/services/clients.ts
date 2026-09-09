import type { Client, ClientActivityEvent } from "@/types";
import { clientActivity, clients, getClientById } from "@/lib/mock-data";
import { simulateLatency } from "./latency";

export async function listClients(): Promise<Client[]> {
  await simulateLatency();
  return clients;
}

export async function fetchClient(id: string): Promise<Client | undefined> {
  await simulateLatency();
  return getClientById(id);
}

export async function fetchClientActivity(clientId: string): Promise<ClientActivityEvent[]> {
  await simulateLatency();
  return clientActivity
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
