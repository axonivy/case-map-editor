import type { CaseMapModel } from '@axonivy/case-map-editor-protocol';

export const generateName = (
  process: string,
  processes: {
    value: string;
    name: string;
    detail: string;
  }[]
): string => {
  const found = processes.find(p => p.value === process);
  if (!found) return 'Name';

  return formatProcessName(found.name);
};

export const formatProcessName = (name: string): string => {
  if (!name) return '';
  name = name.replace(/_/g, ' ');
  const words = name.match(/([A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|\d+)/g);

  if (!words) return name;
  return words
    .map(word => {
      if (word.toUpperCase() === word) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const generateUniqueId = (name: string, caseMap: CaseMapModel): string => {
  const baseId = name.toLowerCase().trim().replace(/\s+/g, '');
  if (!baseId) return 'newid';

  let id = baseId;
  let counter = 1;

  const idExists = (checkId: string) =>
    caseMap.stages?.some(stage => stage.id === checkId) ||
    caseMap.stages?.some(stage => stage.processes?.some(process => process.id === checkId)) ||
    caseMap.stages?.some(stage => stage.sidesteps?.some(sideStep => sideStep.id === checkId));

  while (idExists(id)) {
    counter += 1;
    id = `${baseId}${counter}`;
  }

  return id;
};
