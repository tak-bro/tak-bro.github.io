import { uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from './i18n';

// @fumadocs/language ships zh-cn and zh-tw only — there is no Korean pack, so the
// chrome strings are supplied here. Anything not listed falls back to the English
// key text, which is why this can stay a subset rather than all ~50 UI keys.
const korean = {
  name: '한국어',
  value: {
    // i18nProvider reads the switcher label from this key and falls back to the
    // literal string "English" when it is missing — which makes every entry in
    // the language menu read "English".
    displayName: '한국어',
    'Search(search dialog)': '검색',
    'Search(search trigger)': '검색',
    'Open Search(search trigger)(aria-label)': '검색 열기',
    'Close Search(search dialog)(aria-label)': '검색 닫기',
    'No results found(search dialog)': '결과 없음',
    'On this page(table of contents)': '이 페이지에서',
    'No Headings(table of contents)': '제목 없음',
    'Table of Contents(inline table of contents)': '목차',
    'Next Page(pagination)': '다음 페이지',
    'Previous Page(pagination)': '이전 페이지',
    'Last updated on(page footer)': '마지막 수정',
    'Choose a language(language switcher)': '언어 선택',
    'Choose a language(language switcher)(aria-label)': '언어 선택',
    'Toggle Theme(theme switcher)(aria-label)': '테마 전환',
    'Light(theme switcher)(aria-label)': '라이트',
    'Dark(theme switcher)(aria-label)': '다크',
    'System(theme switcher)(aria-label)': '시스템',
    'Open Sidebar(aria-label)': '사이드바 열기',
    'Close Sidebar(aria-label)': '사이드바 닫기',
    'Show Sidebar(sidebar)': '사이드바 보기',
    'Hide Sidebar(sidebar)': '사이드바 숨기기',
    'Collapse Sidebar(sidebar)(aria-label)': '사이드바 접기',
    'Toggle Menu(home layout header)(aria-label)': '메뉴 전환',
    'Copy Text(code block)(aria-label)': '텍스트 복사',
    'Copied Text(code block)(aria-label)': '복사됨',
    'Copy Anchor Link(heading anchor)(aria-label)': '링크 복사',
    'Copy Markdown(page actions)': '마크다운 복사',
    'View as Markdown(page actions)': '마크다운으로 보기',
    'Page Not Found(404 not found page)': '페이지를 찾을 수 없습니다',
    'Back to Home(404 not found page)': '홈으로',
    'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)':
      '찾으시는 페이지가 삭제되었거나, 이름이 바뀌었거나, 일시적으로 사용할 수 없습니다.',
  },
} as const;

export const translations = i18n.translations().extend(uiTranslations()).preset('ko', korean);
