import { AddNewTrainerData, AddNewTrainerVariables, GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables, BookClassData, BookClassVariables, ListAvailableMembershipsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewTrainer(options?: useDataConnectMutationOptions<AddNewTrainerData, FirebaseError, AddNewTrainerVariables>): UseDataConnectMutationResult<AddNewTrainerData, AddNewTrainerVariables>;
export function useAddNewTrainer(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewTrainerData, FirebaseError, AddNewTrainerVariables>): UseDataConnectMutationResult<AddNewTrainerData, AddNewTrainerVariables>;

export function useGetClassesTaughtByTrainer(vars: GetClassesTaughtByTrainerVariables, options?: useDataConnectQueryOptions<GetClassesTaughtByTrainerData>): UseDataConnectQueryResult<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;
export function useGetClassesTaughtByTrainer(dc: DataConnect, vars: GetClassesTaughtByTrainerVariables, options?: useDataConnectQueryOptions<GetClassesTaughtByTrainerData>): UseDataConnectQueryResult<GetClassesTaughtByTrainerData, GetClassesTaughtByTrainerVariables>;

export function useBookClass(options?: useDataConnectMutationOptions<BookClassData, FirebaseError, BookClassVariables>): UseDataConnectMutationResult<BookClassData, BookClassVariables>;
export function useBookClass(dc: DataConnect, options?: useDataConnectMutationOptions<BookClassData, FirebaseError, BookClassVariables>): UseDataConnectMutationResult<BookClassData, BookClassVariables>;

export function useListAvailableMemberships(options?: useDataConnectQueryOptions<ListAvailableMembershipsData>): UseDataConnectQueryResult<ListAvailableMembershipsData, undefined>;
export function useListAvailableMemberships(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableMembershipsData>): UseDataConnectQueryResult<ListAvailableMembershipsData, undefined>;
