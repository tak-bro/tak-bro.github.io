import { Arrow, Box, Diagram } from '../diagram';
import { pick, type DiagramLangProps } from './lang';

// Source: dotfiles karabiner/karabiner.json (no rules; disable_built_in_keyboard_if_exists on three devices),
// macos-defaults.sh 141-217 (key repeat, text input, DefaultkeyBinding.dict), ghostty/config 58-75 (keybind,
// macos-option-as-alt) and nvim/config/lua/config/keymaps.lua (LazyVim defaults, no personal keymaps).
const LAYER_COPY = {
  ko: {
    title: '키 입력은 다섯 층을 지나고, 층마다 키를 바꿀 기회가 있어요',
    description:
      '키보드에서 나온 입력은 Karabiner, macOS, Ghostty 를 지나 셸·herdr·Neovim 에 닿아요. Karabiner 에는 리맵 없이 기기 설정만 있고, macOS 는 키 반복과 문자 입력 규칙을, Ghostty 는 keybind 를 정해요. 마지막으로 Neovim 이 받은 키를 자기 키맵으로 읽어요.',
    layers: [
      ['키보드', '내장 또는 외장'],
      ['Karabiner', '리맵 없이 기기 설정만'],
      ['macOS', '키 반복·KeyBindings'],
      ['Ghostty', 'keybind'],
      ['셸 · herdr · Neovim', '받은 키를 자기 방식으로'],
    ],
  },
  en: {
    title: 'A key press passes five layers, and each layer can change it',
    description:
      'Input from the keyboard passes Karabiner, macOS and Ghostty before it reaches the shell, herdr or Neovim. Karabiner holds only a device setting, no remaps; macOS sets key repeat and text input rules; Ghostty sets keybinds. Last, Neovim reads the key through its own keymap.',
    layers: [
      ['Keyboard', 'built-in or external'],
      ['Karabiner', 'device setting, no remaps'],
      ['macOS', 'key repeat, KeyBindings'],
      ['Ghostty', 'keybind'],
      ['Shell · herdr · Neovim', 'each reads it its own way'],
    ],
  },
};

const STEP = 66;
const H = 48;
const rowY = (i: number) => 12 + i * STEP;

export const KeyLayersDiagram = ({ lang }: DiagramLangProps) => {
  const copy = pick(LAYER_COPY, lang);
  const last = copy.layers.length - 1;
  return (
    <Diagram width={360} height={rowY(last) + H + 12} title={copy.title} description={copy.description}>
      {copy.layers.map(([label, sub], i) => (
        <g key={label}>
          {i > 0 ? <Arrow points={[[180, rowY(i - 1) + H], [180, rowY(i) - 2]]} /> : null}
          <Box x={40} y={rowY(i)} w={280} h={H} label={label} sub={sub} tone={i === 0 ? 'brand' : 'default'} />
        </g>
      ))}
    </Diagram>
  );
};
