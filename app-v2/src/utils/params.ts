import {
  isMetric,
  isPlayerType,
  isPlayerBuild,
  isCountry,
  isComputedMetric,
  NameChangeStatus,
} from "@wise-old-man/utils";

export function getMetricParam(param: string | undefined | null) {
  if (!param || !isMetric(param)) return undefined;
  return param;
}

export function getPlayerTypeParam(param: string | undefined | null) {
  if (!param || !isPlayerType(param)) return undefined;
  return param;
}

export function getPlayerBuildParam(param: string | undefined | null) {
  if (!param || !isPlayerBuild(param)) return undefined;
  return param;
}

export function getCountryParam(param: string | undefined | null) {
  if (!param || !isCountry(param)) return undefined;
  return param;
}

export function getComputedMetricParam(param: string | undefined | null) {
  if (!param || (!isComputedMetric(param) && param !== "combined")) return undefined;
  return param;
}

export function getNameChangeStatusParam(param: string | undefined | null) {
  if (!param || !Object.values(NameChangeStatus).includes(param as any)) return undefined;
  return param as NameChangeStatus;
}

export function getSearchParam(param: string | undefined | null) {
  if (!param || typeof param !== "string") return undefined;
  return param;
}

export function getPageParam(param: string | undefined | null) {
  if (!param || typeof param !== "string" || !Number.isInteger(Number(param)) || Number(param) < 1) {
    return undefined;
  }

  return parseInt(param);
}
