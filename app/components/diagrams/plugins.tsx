import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: dotfiles install.sh (plugins: marketplaces, then enabledPlugins true only; register_claude_mcp_servers
// adds only missing names to ~/.claude.json; register_agent_mcp_servers with AGENT_MCP_SERVERS=(qmd) in lib/mcp.sh)
// and agent-config install.sh (settings.json is copied once, not linked).
const RESTORE_COPY = {
  ko: {
    title: '설치 스크립트가 두 목록을 읽어 없는 것만 다시 붙여요',
    description:
      '플러그인 목록은 처음 한 번 복사된 ~/.claude/settings.json 의 enabledPlugins 이고, MCP 목록은 dotfiles 의 claude/mcp-servers.json 이에요. dotfiles 의 install.sh 가 둘을 읽어, 플러그인은 true 인 것만 설치하고 MCP 서버는 ~/.claude.json 에 없는 이름만 등록해요. opencode 와 pi 에는 그중 qmd 하나만 넣어요.',
    plugins: '처음 한 번 복사본',
    mcp: 'dotfiles 의 목록',
    install: '없는 것만 붙여요',
    pluginOut: ['플러그인', 'true 인 것만 설치'],
    mcpOut: ['MCP 서버', '없는 이름만 등록'],
    agents: ['opencode · pi', 'qmd 하나만'],
  },
  en: {
    title: 'The install script reads two lists and adds back only what is missing',
    description:
      'The plugin list is enabledPlugins in ~/.claude/settings.json, which was copied once; the MCP list is claude/mcp-servers.json in dotfiles. The dotfiles install.sh reads both: it installs only the plugins set to true and registers only the MCP servers missing from ~/.claude.json. opencode and pi get just one of them, qmd.',
    plugins: 'copied once',
    mcp: 'the dotfiles list',
    install: 'adds only what is missing',
    pluginOut: ['Plugins', 'only those set true'],
    mcpOut: ['MCP servers', 'only missing names'],
    agents: ['opencode · pi', 'qmd only'],
  },
};

export const RestoreListsDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(RESTORE_COPY, lang);
  return (
    <Diagram width={360} height={336} title={copy.title} description={copy.description}>
      <Box x={20} y={12} w={150} h={56} label="settings.json" sub={copy.plugins} />
      <Box x={190} y={12} w={150} h={56} label="mcp-servers.json" sub={copy.mcp} />
      <Arrow points={[[95, 68], [95, 98]]} />
      <Arrow points={[[265, 68], [265, 98]]} />
      <Box x={60} y={100} w={240} h={52} label="install.sh" sub={copy.install} tone="brand" />
      <Arrow points={[[95, 152], [95, 182]]} />
      <Arrow points={[[265, 152], [265, 182]]} />
      <Box x={20} y={184} w={150} h={56} label={copy.pluginOut[0]} sub={copy.pluginOut[1]} />
      <Box x={190} y={184} w={150} h={56} label={copy.mcpOut[0]} sub={copy.mcpOut[1]} />
      <Arrow points={[[265, 240], [265, 266]]} />
      <Box x={190} y={268} w={150} h={56} label={copy.agents[0]} sub={copy.agents[1]} tone="muted" />
    </Diagram>
  );
};
