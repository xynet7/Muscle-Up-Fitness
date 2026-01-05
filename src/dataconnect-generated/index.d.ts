import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewTrainerData {
  trainer_insert: Trainer_Key;
}

export interface AddNewTrainerVariables {
  firstName: string;
  lastName: string;
  specialty: string;
}

export interface BookClassData {
  booking_insert: Booking_Key;
}

export interface BookClassVariables {
  userId: UUIDString;
  classId: UUIDString;
  bookingDate: DateString;
}

export interface Booking_Key {
  userId: UUIDString;
  classId: UUIDString;
  __typename?: 'Booking_Key';
}

export interface Class_Key {
  id: UUIDString;
  __typename?: 'Class_Key';
}

export interface GetClassesTaughtByTrainerData {
  classes: ({
    id: UUIDString;
    name: string;
    scheduleTime: TimestampString;
    durationInMinutes: number;
  } & Class_Key)[];
}

export interface GetClassesTaughtByTrainerVariables {
  trainerId: UUIDString;
}

export interface ListAvailableMembershipsData {
  memberships: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    durationInMonths: number;
  } & Membership_Key)[];
}

export interface Membership_Key {
  id: UUIDString;
  __typename?: 'Membership_Key';
}

export interface Trainer_Key {
  id: UUIDString;
  __typename?: 'Trainer_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddNewTrainerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewTrainerVariables): MutationRef<AddNewTrainerData, AddNewTrainerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewTrainerVariables): MutationRef<AddNewTrainerData, AddNewTrainerVariables>;
  operationName: string;
}
export const addNewTrainerRef: AddNewTrainerRef;

export function addNewTrainer(vars: AddNewTrainerVariables): MutationPromise<AddNewTrainerData, AddNewTrainerVariables>;
export function addNewTrainer(dc: DataConnect, vars: AddNewTrainerVariables): MutationPromise<AddNewTrainerData, AddNewTrainerVariables>;

interface GetClassesTaughtByTrainerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetClassesTaughtByTrainerVariables): QueryRef<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetClassesTaughtByTrainerVariables): QueryRef<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
  operationName: string;
}
export const getClassesTaughtByTrainerRef: GetClassesTaughtByTrainerRef;

export function getClassesTaughtByTrainer(vars: GetClassesTaughtByTrainerVariables): QueryPromise<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
export function getClassesTaughtByTrainer(dc: DataConnect, vars: GetClassesTaughtByTrainerVariables): QueryPromise<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;

interface BookClassRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BookClassVariables): MutationRef<BookClassData, BookClassVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BookClassVariables): MutationRef<BookClassData, BookClassVariables>;
  operationName: string;
}
export const bookClassRef: BookClassRef;

export function bookClass(vars: BookClassVariables): MutationPromise<BookClassData, BookClassVariables>;
export function bookClass(dc: DataConnect, vars: BookClassVariables): MutationPromise<BookClassData, BookClassVariables>;

interface ListAvailableMembershipsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableMembershipsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableMembershipsData, undefined>;
  operationName: string;
}
export const listAvailableMembershipsRef: ListAvailableMembershipsRef;

export function listAvailableMemberships(): QueryPromise<ListAvailableMembershipsData, undefined>;
export function listAvailableMemberships(dc: DataConnect): QueryPromise<ListAvailableMembershipsData, undefined>;

