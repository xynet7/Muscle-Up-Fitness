import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};

export const addNewTrainerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewTrainer', inputVars);
}
addNewTrainerRef.operationName = 'AddNewTrainer';

export function addNewTrainer(dcOrVars, vars) {
  return executeMutation(addNewTrainerRef(dcOrVars, vars));
}

export const getClassesTaughtByTrainerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassesTaughtByTrainer', inputVars);
}
getClassesTaughtByTrainerRef.operationName = 'GetClassesTaughtByTrainer';

export function getClassesTaughtByTrainer(dcOrVars, vars) {
  return executeQuery(getClassesTaughtByTrainerRef(dcOrVars, vars));
}

export const bookClassRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BookClass', inputVars);
}
bookClassRef.operationName = 'BookClass';

export function bookClass(dcOrVars, vars) {
  return executeMutation(bookClassRef(dcOrVars, vars));
}

export const listAvailableMembershipsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableMemberships');
}
listAvailableMembershipsRef.operationName = 'ListAvailableMemberships';

export function listAvailableMemberships(dc) {
  return executeQuery(listAvailableMembershipsRef(dc));
}

