import { Severity } from './types';

const ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

export function evaluateRunStatus(
  violationsBySeverity: Record<Severity, number>,
  maxAllowedBySeverity: Partial<Record<Severity, number>>,
  failOnThresholdBreach: boolean,
): 'pass' | 'fail' {
  if (!failOnThresholdBreach) {
    return 'pass';
  }

  if (violationsBySeverity.critical > 0 || violationsBySeverity.high > 0) {
    return 'fail';
  }

  for (const severity of ORDER) {
    const max = maxAllowedBySeverity[severity];
    if (typeof max === 'number' && violationsBySeverity[severity] > max) {
      return 'fail';
    }
  }

  return 'pass';
}
