export const formatStatuses = (statuses) => {
  let jiraCount = 0;
  let result = [];

  for (const entry of statuses) {
    if (entry.status === "CS_TICKET" || entry.status === "IT_TICKET") {
      jiraCount += entry._count.status;
    } else {
      result.push(entry);
    }
  }

  if (jiraCount > 0) {
    result.push({ _count: { status: jiraCount }, status: "JIRA_TICKET" });
  }

  return result;
};

export const formatPriortiy = (priorities) => {
  const order = ["HIGH", "MEDIUM", "LOW"];

  return order.map((priority) => {
    const match = priorities.find((t) => t.priority === priority);

    return match ?? { priority, _count: { priority: 0 } };
  });
};
