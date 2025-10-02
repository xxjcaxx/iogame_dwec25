
export default {

  // Optional: Silence Sass deprecation warnings. See note below.
  css: {
     preprocessorOptions: {
        scss: {
          silenceDeprecations: [
            'import',
           // 'mixed-decls',
            'color-functions',
            'global-builtin',
          ],
        },
     },
  },
}

