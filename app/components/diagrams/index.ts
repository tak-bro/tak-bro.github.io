import { CrossModelReviewDiagram, HarnessRepoDiagram, HookGateDiagram } from './agent-config';
import { BranchTokenDiagram } from './herdr';
import { FridayLanesDiagram, KnowledgeLoopDiagram, PlanAnatomyDiagram } from './knowledge';
import { ContractFlowDiagram, ReviewSplitDiagram } from './principles';
import { SetupMapDiagram } from './setup-map';
import { SkillMapDiagram } from './skills';
import { OrchChainDiagram, SliceLoopDiagram } from './workflow';

/**
 * Every guide diagram, by the name MDX uses. Names end in `Diagram`: scripts/check-guides.mjs counts
 * them that way to keep the Korean and English pages drawing the same figures.
 */
export const guideDiagrams = { SetupMapDiagram, HarnessRepoDiagram, HookGateDiagram, CrossModelReviewDiagram, ContractFlowDiagram, ReviewSplitDiagram, OrchChainDiagram, SliceLoopDiagram, KnowledgeLoopDiagram, PlanAnatomyDiagram, FridayLanesDiagram, BranchTokenDiagram, SkillMapDiagram };
