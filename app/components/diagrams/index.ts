import { CrossModelReviewDiagram, HarnessRepoDiagram, HookGateDiagram } from './agent-config';
import { ContractFlowDiagram, ReviewSplitDiagram } from './principles';

/**
 * Every guide diagram, by the name MDX uses. Names end in `Diagram`: scripts/check-guides.mjs counts
 * them that way to keep the Korean and English pages drawing the same figures.
 */
export const guideDiagrams = { HarnessRepoDiagram, HookGateDiagram, CrossModelReviewDiagram, ContractFlowDiagram, ReviewSplitDiagram };
