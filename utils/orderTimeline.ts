const stages = ['pending', 'approved', 'processing', 'completed'] as const;
export function normalizeOrderStatus(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : 'pending';
}
export function orderTimeline(status: unknown, createdAt?: string, updatedAt?: string) {
  const current = normalizeOrderStatus(status);
  const index = stages.indexOf(current as typeof stages[number]);
  const validDate = (value?: string) => value && !Number.isNaN(Date.parse(value)) ? value : null;
  const labels = ['Order Placed', 'Order Approved', 'Processing', 'Completed'];
  const steps = stages.map((stage, position) => ({
    status: stage, label: labels[position],
    isDone: index >= position, isCurrent: current === stage,
    date: position === 0 ? validDate(createdAt) : current === stage ? validDate(updatedAt) : null,
  }));
  if (current === 'cancelled' || current === 'rejected') steps.push({ status: current as typeof stages[number], label: current === 'cancelled' ? 'Cancelled' : 'Rejected', isDone: true, isCurrent: true, date: validDate(updatedAt) });
  return steps;
}
