export type DomainEventType =
  | "DEBT_CREATED"
  | "DEBT_SETTLED"
  | "DEBT_UPDATED"
  | "DEBT_DELETED";

export interface BaseDomainEvent<T = unknown> {
  eventId: string;
  eventType: DomainEventType;
  occurredAt: Date;
  userId: string;
  payload: T;
}

export interface DebtCreatedPayload {
  debtId: string;
  type: "owed_to_me" | "i_owe";
  amount: bigint;
  counterpartName: string;
}

export interface DebtSettledPayload {
  debtId: string;
  settledAt: Date;
}

export interface DebtUpdatedPayload {
  debtId: string;
  type: "owed_to_me" | "i_owe";
  amount: bigint;
  counterpartName: string;
}

export interface DebtDeletedPayload {
  debtId: string;
}

export type DomainEvent =
  | BaseDomainEvent<DebtCreatedPayload> & { eventType: "DEBT_CREATED" }
  | BaseDomainEvent<DebtSettledPayload> & { eventType: "DEBT_SETTLED" }
  | BaseDomainEvent<DebtUpdatedPayload> & { eventType: "DEBT_UPDATED" }
  | BaseDomainEvent<DebtDeletedPayload> & { eventType: "DEBT_DELETED" };
