#include <stdlib.h>
#include <stdio.h>
#include <fontconfig/fontconfig.h>

// Based on fc-scan
const void print_font_family(const char *path) {
  FcFontSet *fs = FcFontSetCreate();
  FcFileScan(fs, NULL, NULL, NULL, path, FcFalse);

  if (fs->nfont) {
    FcPattern *pattern = fs->fonts[0];
    FcChar8 *family = FcPatternFormat(pattern, "%{family}");
    if (family) {
      printf("%s", family);
      FcStrFree(family);
    }
  }

  FcFontSetDestroy (fs);
}

const void add_font(const char *path) {
  if (!path) return;

  if (FcConfigAppFontAddFile(
    FcConfigGetCurrent(),
    path
  ) == FcTrue)
    print_font_family(path);
}

int main(int argc, char *argv[]) {
  if (argc <= 1) return EXIT_FAILURE;
  add_font(argv[1]);
  return EXIT_SUCCESS;
}
