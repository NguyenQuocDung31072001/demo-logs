export const getAddAndDeleteIds = ({ currentIds, requestedIds }: { currentIds: any[]; requestedIds: any[] }) => {
  const _currentIds = currentIds.map((id) => id.toString());
  const _requestedIds = requestedIds.map((id) => id.toString());

  const addIds = _requestedIds.filter((id) => !_currentIds.includes(id));
  const deleteIds = _currentIds.filter((id) => !_requestedIds.includes(id));

  return { addIds, deleteIds };
};
