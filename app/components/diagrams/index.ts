import { CrossModelReviewDiagram, HarnessRepoDiagram, HookGateDiagram } from './agent-config';
import { BranchTokenDiagram, KeyPathDiagram } from './herdr';
import { KeyLayersDiagram } from './keymaps';
import { RestoreListsDiagram } from './plugins';
import { ContractFlowDiagram, ReviewSplitDiagram } from './principles';
import { OrchChainDiagram, SliceLoopDiagram } from './workflow';

/**
 * Every guide diagram, by the name MDX uses. Names end in `Diagram`: scripts/check-guides.mjs counts
 * them that way to keep the Korean and English pages drawing the same figures.
 */
export const guideDiagrams = { HarnessRepoDiagram, HookGateDiagram, CrossModelReviewDiagram, ContractFlowDiagram, ReviewSplitDiagram, OrchChainDiagram, SliceLoopDiagram, RestoreListsDiagram, KeyPathDiagram, BranchTokenDiagram, KeyLayersDiagram };
