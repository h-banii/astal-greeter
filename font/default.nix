{ stdenv, pkgs, ... }:
stdenv.mkDerivation {
  name = "fontloader";
  src = ./.;
  buildInputs = with pkgs; [
    fontconfig
  ];
  buildPhase = ''
    mkdir -p $out/bin
    $CC fontloader.c -o $out/bin/fontloader -lfontconfig
  '';
  meta = {
    mainProgram = "fontloader";
  };
}
