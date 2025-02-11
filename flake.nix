{
  inputs = {
    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
      astalPackages = ags.inputs.astal.packages.${system};
      extraPackages = [
        astalPackages.greet
        pkgs.matugen
        pkgs.dart-sass
        self.packages.${system}.fontloader
      ];
      inherit (nixpkgs) lib;
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          ((ags.packages.${system}.default.override {
            inherit extraPackages;
          }).overrideAttrs
          (prev: {
            # https://github.com/NixOS/nixpkgs/issues/321983
            # https://github.com/NixOS/nixpkgs/issues/221017
            postInstall = lib.concatStrings [
              (prev.postInstall or "")
              ''
                export GDK_PIXBUF_MODULE_FILE="${
                  pkgs.gnome._gdkPixbufCacheBuilder_DO_NOT_USE {
                    extraLoaders = [
                      pkgs.librsvg
                      pkgs.webp-pixbuf-loader
                    ];
                  }
                }"
              ''
            ];
          }))
          nodejs
          nodePackages.npm
          gtk4
          matugen
          dart-sass
          self.packages.${system}.fontloader
        ];
        shellHook = ''
          export AGS_DIR=''$PWD
          run() {
            ags run "''${AGS_DIR}/src/app.ts" --gtk4 --define SRC="'""''${AGS_DIR}'" "$@"
          }
          format() {
            npx prettier ''${AGS_DIR}/src --write
          }
          tmp=`mktemp`
          jq '.dependencies.astal |= "${astalPackages.gjs}/share/astal/gjs"' < package.json > $tmp
          mv $tmp package.json
          npm i --frozen-lockfile
        '';
      };

      packages.${system} =
        let
          name = "h-banii.greeter-shell";
        in
        rec {
          default = greeter;
          greeter = ags.lib.bundle {
            inherit pkgs extraPackages name;
            src = ./.;
            entry = "src/app.ts";
            gtk4 = true;
          };
          fontloader = pkgs.callPackage ./font { };
          example = pkgs.symlinkJoin {
            inherit name;

            paths = [ greeter ];

            nativeBuildInputs = with pkgs; [ makeWrapper ];

            postBuild = ''
              wrapProgram $out/bin/${name} \
                --set H_BANII_GREET_WALLPAPER /home/hbanii/wallpapers/1370937.png
            '';
          };
        };
    };
}
