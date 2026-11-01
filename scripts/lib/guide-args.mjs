/** `[slug…] [--min N]` → the slugs named (empty = every guide) and the diagram floor (default 1). */
export const parseGuideArgs = (argv) => {
  const slugs = [];
  let min = 1;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] !== '--min') {
      slugs.push(argv[i]);
      continue;
    }
    min = Number(argv[++i]);
    if (!Number.isInteger(min) || min < 0) throw new Error(`--min needs a whole number, got ${argv[i]}`);
  }
  return { slugs, min };
};
