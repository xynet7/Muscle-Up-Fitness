const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'studio',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addNewTrainerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewTrainer', inputVars);
}
addNewTrainerRef.operationName = 'AddNewTrainer';
exports.addNewTrainerRef = addNewTrainerRef;

exports.addNewTrainer = function addNewTrainer(dcOrVars, vars) {
  return executeMutation(addNewTrainerRef(dcOrVars, vars));
};

const getClassesTaughtByTrainerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetClassesTaughtByTrainer', inputVars);
}
getClassesTaughtByTrainerRef.operationName = 'GetClassesTaughtByTrainer';
exports.getClassesTaughtByTrainerRef = getClassesTaughtByTrainerRef;

exports.getClassesTaughtByTrainer = function getClassesTaughtByTrainer(dcOrVars, vars) {
  return executeQuery(getClassesTaughtByTrainerRef(dcOrVars, vars));
};

const bookClassRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'BookClass', inputVars);
}
bookClassRef.operationName = 'BookClass';
exports.bookClassRef = bookClassRef;

exports.bookClass = function bookClass(dcOrVars, vars) {
  return executeMutation(bookClassRef(dcOrVars, vars));
};

const listAvailableMembershipsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableMemberships');
}
listAvailableMembershipsRef.operationName = 'ListAvailableMemberships';
exports.listAvailableMembershipsRef = listAvailableMembershipsRef;

exports.listAvailableMemberships = function listAvailableMemberships(dc) {
  return executeQuery(listAvailableMembershipsRef(dc));
};
