import {
  Log,
  Label,
  LogLevelDefinition,
  Defaults,
} from '.';

type LabelMap = Map<string, Label>;

export type ListenerLocations = Array<[number, number]>;

export type Listeners = Map<number, Map<number, ListenerCallback>>;

export interface ListenerData extends Log, LogLevelDefinition {
  args: any[];
}

export type ListenerCallback = (log: ListenerData) => void;

interface ShedProps {
  cfg: Defaults;
  cache: Array<[Log, LogLevelDefinition, any[]]>;
  id_counter: number;
  listeners: Listeners;
  labels: LabelMap;
}

interface ShedMethods {
  assignId(this: Shed): number;
  addToCache(this: Shed, loog: Log, args: any[]): void;
  addListener(this: Shed, levels: number[], cb: ListenerCallback): void;
  removeListener(this: Shed, locations: ListenerLocations): void;
  fireListeners(this: Shed, log: Log, args: any[]): void;
}

export interface Shed extends ShedProps, ShedMethods {}