import { EntityMetadata } from 'typeorm';

function buildEntityKey<T>(entity: T, pkFields: string[]): string {
  return pkFields.map((k) => entity[k]).join('|');
}

export function mergeEntitiesWithoutDuplicates<T>(
  existing: T[],
  incoming: T[],
  metadata: EntityMetadata,
): T[] {
  const pkFields = metadata.primaryColumns.map((col) => col.propertyName);
  const existingSet = new Set(existing.map((e) => buildEntityKey(e, pkFields)));

  return [
    ...existing,
    ...incoming.filter((e) => !existingSet.has(buildEntityKey(e, pkFields))),
  ];
}

export function removeEntitiesFromRelation<T>(
  existing: T[],
  toRemove: T[],
  metadata: EntityMetadata,
): T[] {
  const pkFields = metadata.primaryColumns.map((col) => col.propertyName);
  const removeSet = new Set(toRemove.map((e) => buildEntityKey(e, pkFields)));

  return existing.filter((e) => !removeSet.has(buildEntityKey(e, pkFields)));
}

export function syncManyToManyRelation<T>(
  existing: T[],
  toAdd: T[],
  toRemove: T[],
  metadata: EntityMetadata,
): T[] {
  const afterRemoval = removeEntitiesFromRelation(existing, toRemove, metadata);
  return mergeEntitiesWithoutDuplicates(afterRemoval, toAdd, metadata);
}
